import { GoogleGenAI, Modality } from "@google/genai";

let sharedAudioContext: AudioContext | null = null;

// Helper to manually decode base64 as per instructions
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode raw 16-bit PCM into an AudioBuffer
async function decodePCM(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Convert 16-bit signed integer to float range [-1, 1]
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

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

async function executeWithRetry<T>(fn: (ai: GoogleGenAI) => Promise<T>, retries = 3, baseDelay = 2000): Promise<T> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      return await fn(ai);
    } catch (error: any) {
      const isQuotaError = 
        error?.message?.includes('429') || 
        error?.status === 429 || 
        error?.message?.toLowerCase().includes('quota') ||
        error?.message?.toLowerCase().includes('resource_exhausted');

      if (isQuotaError && attempt < retries) {
        attempt++;
        const waitTime = (baseDelay * Math.pow(2, attempt)) + (Math.random() * 1000);
        console.warn(`Quota reached (Attempt ${attempt}/${retries}). Retrying...`);
        await delay(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Maximum retries reached.");
}

export async function generateNodeBio(name: string, role: string, context: 'family' | 'knowledge' | 'dua') {
  return executeWithRetry(async (ai) => {
    let prompt = `Generate a short, intriguing 2-sentence historical biography for ${name}, who is a ${role}.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "No further details available.";
  });
}

export async function speakText(text: string): Promise<string | null> {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // Voice names: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const audioPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (audioPart?.inlineData?.data) {
      return audioPart.inlineData.data;
    }
    throw new Error("Audio generation failed: No audio data in response.");
  });
}

export async function playRawPCM(base64: string): Promise<void> {
  const ctx = await getAudioContext();
  
  // Resuming context right away to satisfy browser user-gesture requirements
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  const audioBytes = decodeBase64(base64);
  const audioBuffer = await decodePCM(audioBytes, ctx, 24000, 1);

  return new Promise((resolve) => {
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.onended = () => resolve();
    source.start(0);
  });
}
