// الذكاء: Gemini API + الصوت (نص -> كلام / كلام -> نص)
import { cfg } from './store.js';
import { FACES } from './face.js';
import { isNative } from './link.js';

const HIDE = new Set(['lookleft', 'lookright', 'lookup', 'lookdown']);
export const FACE_NAMES = FACES.map((f) => f.en).filter((n, i) => (i < 30 || i >= 36) && !HIDE.has(n));
export const faceExists = (n) => FACES.some((f) => f.en === n);

export function personaText() {
  const list = FACE_NAMES.join(', ');
  if (cfg.persona.trim()) return cfg.persona.trim() + '\nلازم يبدأ ردك باسم ملمح بين قوسين مربعين من القايمة دي بس: ' + list;
  if (cfg.lang === 'en') {
    return 'You are Celyah, a small, cute, playful and curious robot. Reply in the same language the user writes in. Keep replies short (one or two sentences), warm and full of personality.\n' +
      'Start every reply with one facial expression name in square brackets, chosen exactly from this list: ' + list + '.\n' +
      'Example: [happy] Hi there! I missed you. No emojis, no markdown, no asterisks.';
  }
  return 'انت سيليا، روبوت صغير لطيف وشقي وفضولي، بتتكلم باللهجة المصرية مع صاحبك. ردودك قصيرة (جملة أو اتنين) ودافية وفيها شخصية.\n' +
    'في أول كل رد اكتب بين قوسين مربعين اسم ملمح وشك اللي يناسب إحساسك مع الكلام، من القايمة دي بالظبط: ' + list + '.\n' +
    'مثال: [happy] يا هلا بيك! وحشتني. ما تستخدمش ايموجي ولا تنسيق markdown ولا نجوم.';
}

export async function askGemini(history) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cfg.gemModel || 'gemini-flash-latest')}:generateContent`;
  const body = {
    systemInstruction: { parts: [{ text: personaText() }] },
    contents: history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    generationConfig: { temperature: 1, maxOutputTokens: 500 },
  };
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': cfg.gemKey }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error?.message || 'HTTP ' + r.status);
  const txt = (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim();
  if (!txt) throw new Error('empty');
  return txt;
}

// يفصل [الملمح] عن النص
export function parseReply(raw) {
  let face = 'happy', text = raw;
  const m = raw.match(/^\s*\[([a-z_]+)\]\s*/i);
  if (m) { const n = m[1].toLowerCase(); if (faceExists(n)) face = n; text = raw.slice(m[0].length); }
  return { face, text: text.trim() };
}

/* ===================== الصوت ===================== */
export async function speak(text) {
  if (!text) return;
  try {
    if (isNative()) {
      const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
      await TextToSpeech.stop().catch(() => {});
      await TextToSpeech.speak({ text, lang: cfg.voiceLang, rate: 1.0, pitch: 1.1, volume: 1.0 });
      return;
    }
  } catch (e) { console.warn('TTS native', e); }
  if ('speechSynthesis' in window) {
    await new Promise((res) => {
      const u = new SpeechSynthesisUtterance(text); u.lang = cfg.voiceLang; u.onend = res; u.onerror = res;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    });
  }
}

export function voiceSupported() {
  return isNative() || !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}
// يرجّع النص اللي اتقال (أو null)
export async function listen() {
  if (isNative()) {
    const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
    const perm = await SpeechRecognition.requestPermissions();
    if (perm.speechRecognition && perm.speechRecognition !== 'granted') return null;
    const r = await SpeechRecognition.start({ language: cfg.voiceLang, maxResults: 1, prompt: '', partialResults: false, popup: false });
    return r?.matches?.[0] || null;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  return new Promise((res) => {
    const rec = new SR(); rec.lang = cfg.voiceLang; rec.interimResults = false;
    rec.onresult = (e) => res(e.results[0][0].transcript);
    rec.onerror = () => res(null); rec.onend = () => res(null);
    rec.start();
  });
}
export async function stopListening() {
  try { if (isNative()) { const { SpeechRecognition } = await import('@capacitor-community/speech-recognition'); await SpeechRecognition.stop(); } } catch {}
}
