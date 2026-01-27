import { GoogleGenAI } from "@google/genai";

let sharedAudioContext: AudioContext | null = null;

/**
 * Manually decode a base64 string into a Uint8Array.
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
 * Decodes raw 16-bit PCM data into an AudioBuffer.
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
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Wakes up or creates the AudioContext.
 */
export async function initAudioContext() {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  if (sharedAudioContext.state === 'suspended') {
    await sharedAudioContext.resume();
  }
  return sharedAudioContext;
}

/**
 * Alternative: Browser Native Speech Synthesis.
 * This works offline and doesn't require an API key.
 */
export function speakWithBrowser(text: string): Promise<void> {
  return new Promise((resolve) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Detect if text is Arabic to choose right voice if available
    if (/[\u0600-\u06FF]/.test(text)) {
      utterance.lang = 'ar-SA';
    } else {
      utterance.lang = 'en-US';
    }
    
    utterance.rate = 0.9;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve(); // Resolve anyway to clean up loading states
    
    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Executes Gemini API calls with minimal retries for speed.
 */
async function executeApiCall<T>(fn: (ai: GoogleGenAI) => Promise<T>): Promise<T> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Key Missing");
  const ai = new GoogleGenAI({ apiKey });
  return await fn(ai);
}

/**
 * Historical bio generation.
 */
export async function generateNodeBio(name: string, role: string, context: 'family' | 'knowledge' | 'dua') {
  try {
    return await executeApiCall(async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a short, intriguing 2-sentence historical biography for ${name}, who is a ${role}.`,
      });
      return response.text?.trim() || "Details archived.";
    });
  } catch (e) {
    return "Historical record remains preserved in the family archives.";
  }
}

/**
 * Generates AI audio.
 */
export async function speakText(text: string): Promise<string | null> {
  try {
    return await executeApiCall(async (ai) => {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });
      return response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data || null;
    });
  } catch (e) {
    console.warn("Gemini TTS failed, falling back to browser speech.");
    return null; // Signals to use fallback
  }
}

/**
 * Plays the AI generated PCM audio.
 */
export async function playRawPCM(base64: string): Promise<void> {
  const ctx = await initAudioContext();
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
