import { GoogleGenAI, Modality } from "@google/genai";

let sharedAudioContext: AudioContext | null = null;

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
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    if (audioData) return audioData;
    throw new Error("Audio generation failed.");
  });
}

export async function playRawPCM(base64: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const ctx = await getAudioContext();
      if (ctx.state !== 'running') await ctx.resume();

      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const frameCount = Math.floor(len / 2);
      if (frameCount <= 0) {
        resolve();
        return;
      }

      const buffer = ctx.createBuffer(1, frameCount, 24000);
      const channelData = buffer.getChannelData(0);
      const dataView = new DataView(bytes.buffer);

      for (let i = 0; i < frameCount; i++) {
        // Read 16-bit signed PCM data
        channelData[i] = dataView.getInt16(i * 2, true) / 32768.0;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => resolve();
      source.start(0);
    } catch (e) {
      console.error("Playback error:", e);
      reject(e);
    }
  });
}