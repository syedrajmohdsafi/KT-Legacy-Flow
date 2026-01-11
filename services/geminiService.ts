
import { GoogleGenAI, Modality } from "@google/genai";

// Singleton AudioContext for performance
let sharedAudioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume();
  }
  return sharedAudioContext;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Robust execution wrapper with retry logic for Gemini API
 */
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
        // Jittered exponential backoff: base * 2^attempt + random
        const waitTime = (baseDelay * Math.pow(2, attempt)) + (Math.random() * 1000);
        console.warn(`Quota reached (Attempt ${attempt}/${retries}). Retrying in ${Math.round(waitTime)}ms...`);
        await delay(waitTime);
        continue;
      }
      
      // If it's a quota error and we're out of retries, or not a quota error
      if (isQuotaError) {
        throw new Error("API Quota Exceeded. Please try again in a few minutes.");
      }
      throw error;
    }
  }
  throw new Error("Maximum retries reached.");
}

export async function generateNodeBio(name: string, role: string, context: 'family' | 'knowledge' | 'dua') {
  return executeWithRetry(async (ai) => {
    let prompt = '';
    if (context === 'family') {
      prompt = `Generate a short, intriguing 2-sentence family biography for ${name}, who is a ${role}. Make it sound historical and prestigious.`;
    } else if (context === 'knowledge') {
      prompt = `Generate a short, 2-sentence description of the specialized wisdom passed down to ${name}, who is a ${role}. Make it sound mystical and scholarly.`;
    } else {
      prompt = `Generate a short, 2-sentence spiritual description of the "Dua" (supplication/blessing) carried by ${name}, who is a ${role}. Make it sound sacred and heartfelt.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text?.trim() || "No further details available at this moment.";
  });
}

export async function speakText(text: string): Promise<string | null> {
  return executeWithRetry(async (ai) => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ 
        parts: [{ 
          text: text 
        }] 
      }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ] as any,
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate) {
      throw new Error("No response from the speaker.");
    }

    const parts = candidate.content?.parts;
    const audioPart = parts?.find(p => p.inlineData && p.inlineData.data);
    
    if (audioPart?.inlineData?.data) {
      return audioPart.inlineData.data;
    }

    if (candidate.finishReason && !['STOP', 'MAX_TOKENS'].includes(candidate.finishReason)) {
      throw new Error(`The recitation was interrupted (${candidate.finishReason}).`);
    }
    
    throw new Error(`Audio data was not generated correctly.`);
  });
}

export async function playRawPCM(base64: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const ctx = getAudioContext();
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
        try {
          channelData[i] = dataView.getInt16(i * 2, true) / 32768.0;
        } catch (e) {
          break;
        }
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
