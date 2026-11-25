import { load, save } from '@/utils/storage';

/*
 * Groq chat client (OpenAI-compatible) used by the RMT tutor.
 *
 * Key source, in order:
 *   1. a key saved on this device from Mode Guru → Pengaturan (localStorage), so a public build can ship without a key;
 *   2. VITE_GROQ_API_KEY from .env (handy for local testing).
 * WARNING: any key used in the browser can be read by whoever opens the app (Vite inlines VITE_* values
 * into the bundle). Use a dedicated key with spending limits and rotate it after the study.
 *
 * The SDK is loaded lazily so students who never open the tutor don't download it.
 */

const DEVICE_KEY = 'groqKey';
export const GROQ_MODEL = import.meta.env?.VITE_GROQ_MODEL || 'openai/gpt-oss-20b';

export const getGroqKey = () => load(DEVICE_KEY, '') || import.meta.env?.VITE_GROQ_API_KEY || '';
export const setDeviceGroqKey = (key) => save(DEVICE_KEY, key.trim());
export const hasDeviceGroqKey = () => Boolean(load(DEVICE_KEY, ''));
export const isAiEnabled = () => Boolean(getGroqKey());

/** kind: 'disabled' | 'offline' | 'busy' | 'error' */
export class AiError extends Error {
  constructor(kind, message = kind) {
    super(message);
    this.kind = kind;
  }
}

let cached = { key: null, client: null };

async function getClient() {
  const key = getGroqKey();
  if (!key) throw new AiError('disabled');
  if (cached.key !== key) {
    const { default: Groq } = await import('groq-sdk');
    cached = { key, client: new Groq({ apiKey: key, dangerouslyAllowBrowser: true, maxRetries: 1, timeout: 20_000 }) };
  }
  return cached.client;
}

/**
 * Send a chat conversation and return the assistant text.
 * @param {{role: 'system'|'user'|'assistant', content: string}[]} messages
 */
export async function chat(messages, { maxTokens = 700, temperature = 0.4 } = {}) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new AiError('offline');
  const client = await getClient();
  const isReasoning = GROQ_MODEL.startsWith('openai/gpt-oss');
  try {
    const res = await client.chat.completions.create({
      model: GROQ_MODEL,
      messages,
      temperature,
      max_completion_tokens: maxTokens,
      ...(isReasoning ? { reasoning_effort: 'low' } : {}),
    });
    return res.choices?.[0]?.message?.content?.trim() ?? '';
  } catch (e) {
    if (e?.status === 429) throw new AiError('busy');
    if (e?.status === 401) throw new AiError('disabled', 'Kunci API Groq tidak valid.');
    throw new AiError('error', e?.message);
  }
}
