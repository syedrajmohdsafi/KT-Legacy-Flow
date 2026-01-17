import { GoogleGenAI } from "@google/genai";

let sharedAudioContext: AudioContext | null = null;

/**
 * Manually decode a base64 string into a Uint8Array.
 * Essential for environments without native Buffer support.
 */
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw 16-bit PCM data into an AudioBuffer for the Web Audio API.
 */
async function decodePCM(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Normalizing 16-bit signed PCM [-32768, 32767] to float [-1.0, 1.0]
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Returns a shared, resumed AudioContext. 
 * Browsers require a user gesture to resume the context.
 */
const getAudioContext = async () => {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  if (sharedAudioContext.state === 'suspended') {
    await sharedAudioContext.resume();
  }
  return sharedAudioContext;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Executes a function with automatic retries for quota-related errors.
 * Re-instantiates GoogleGenAI on every attempt to ensure the latest API key is used.
 */
async function executeWithRetry<T>(fn: (ai: GoogleGenAI) => Promise<T>, retries = 2, baseDelay = 2000): Promise<T> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key is missing. Please ensure your project is configured with a valid Gemini API key.");
      }
      const ai = new GoogleGenAI({ apiKey });
      return await fn(ai);
    } catch (error: any) {
      console.error(`Gemini Service Error (Attempt ${attempt + 1}):`, error);
      
      if (error?.message?.includes('Requested entity was not found')) {
         throw new Error("API Key or project configuration error. Please re-select your API key.");
      }

      const isQuotaError = 
        error?.message?.includes('429') || 
        error?.status === 429 || 
        error?.message?.toLowerCase().includes('quota') ||
        error?.message?.toLowerCase().includes('resource_exhausted');

      if (isQuotaError && attempt < retries) {
        attempt++;
        const waitTime = (baseDelay * Math.pow(2, attempt)) + (Math.random() * 1000);
        console.warn(`Quota reached. Retrying in ${Math.round(waitTime)}ms...`);
        await delay(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Maximum retries reached for the request.");
}

export async function generateNodeBio(name: string, role: string, context: 'family' | 'knowledge' | 'dua') {
  return executeWithRetry(async (ai) => {
    let prompt = `Generate a short, intriguing 2-sentence historical biography for ${name}, who is a ${role}. Focus on legacy and heritage.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "No further details available in the archives.";
  });
}

/**
 * Generates audio bytes from text using the Gemini TTS model.
 */
export async function speakText(text: string): Promise<string | null> {
  return executeWithRetry(async (ai) => {
    console.debug("Requesting TTS for:", text.substring(0, 30) + "...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        // Use string literal for maximum compatibility in different SDK versions
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(p => p.inlineData);
    
    if (audioPart?.inlineData?.data) {
      console.debug("TTS successfully generated audio bytes.");
      return audioPart.inlineData.data;
    }
    
    console.error("TTS Response received but contained no audio data.", response);
    throw new Error("The AI generated a response but no audio was returned. Please try again.");
  });
}

/**
 * Plays raw PCM audio bytes encoded in base64 using the Web Audio API.
 */
export async function playRawPCM(base64: string): Promise<void> {
  const ctx = await getAudioContext();
  
  // Browsers require user gesture to resume. Even if handled in handleSpeak, it's safe to check here.
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  const audioBytes = decodeBase64(base64);
  const audioBuffer = await decodePCM(audioBytes, ctx, 24000, 1);

  return new Promise((resolve, reject) => {
    try {
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => resolve();
      source.start(0);
    } catch (err) {
      console.error("Audio Playback Error:", err);
      reject(err);
    }
  });
}
