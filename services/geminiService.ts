
import { GoogleGenAI } from "@google/genai";

let sharedAudioContext: AudioContext | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodePCM(data: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

export async function initAudioContext() {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  if (sharedAudioContext.state === 'suspended') {
    await sharedAudioContext.resume();
  }
  const buffer = sharedAudioContext.createBuffer(1, 1, 22050);
  const node = sharedAudioContext.createBufferSource();
  node.buffer = buffer;
  node.connect(sharedAudioContext.destination);
  node.start(0);
  return sharedAudioContext;
}

export function speakWithBrowser(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) return resolve();
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const isArabic = /[\u0600-\u06FF]/.test(text);
    const voices = window.speechSynthesis.getVoices();
    
    if (isArabic) {
      utterance.voice = voices.find(v => v.lang.startsWith('ar')) || null;
      utterance.lang = 'ar-SA';
    } else {
      utterance.voice = voices.find(v => v.lang.startsWith('en')) || null;
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.9;
    utterance.onend = () => { currentUtterance = null; resolve(); };
    utterance.onerror = () => { currentUtterance = null; resolve(); };
    
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    setTimeout(resolve, 8000);
  });
}

export async function generateNodeBio(name: string, role: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short 2-sentence historical bio for ${name} (${role}).`,
    });
    return response.text?.trim() || "Record preserved.";
  } catch (e) {
    return "Historical record remains preserved in the family archives.";
  }
}

export async function speakText(text: string): Promise<string | null> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
  } catch (e) {
    return null;
  }
}

export async function playRawPCM(base64: string): Promise<void> {
  const ctx = await initAudioContext();
  const audioBytes = decodeBase64(base64);
  const audioBuffer = await decodePCM(audioBytes, ctx, 24000);
  return new Promise((resolve) => {
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.onended = () => resolve();
    source.start(0);
  });
}
