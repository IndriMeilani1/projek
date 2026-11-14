import { attemptsStore, markSynced } from './attempts';

// Sinkronisasi opsional ke API Python. Tanpa VITE_API_URL, aplikasi berjalan mandiri (offline penuh).
export const API_URL = (import.meta.env?.VITE_API_URL || '').replace(/\/$/, '');
export const hasApi = () => Boolean(API_URL);

/** Kirim semua attempt yang sudah dikumpulkan tetapi belum tersinkron. Idempoten di sisi server. */
export async function flushOutbox() {
  if (!hasApi() || !navigator.onLine) return { sent: 0 };
  const pending = Object.values(attemptsStore.get()).filter((a) => a.status === 'submitted' && !a.synced);
  let sent = 0;
  for (const a of pending) {
    try {
      const res = await fetch(`${API_URL}/api/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(a),
      });
      if (res.ok) {
        markSynced(a.id);
        sent++;
      }
    } catch {
      /* coba lagi nanti */
    }
  }
  return { sent };
}

export function startAutoSync() {
  flushOutbox();
  const onOnline = () => flushOutbox();
  window.addEventListener('online', onOnline);
  const t = setInterval(flushOutbox, 30_000);
  return () => {
    window.removeEventListener('online', onOnline);
    clearInterval(t);
  };
}

/** Untuk guru: ambil semua attempt kelas dari API. */
export async function fetchClassAttempts(classCode, teacherKey) {
  const res = await fetch(`${API_URL}/api/attempts?class_code=${encodeURIComponent(classCode)}`, {
    headers: { 'X-Teacher-Key': teacherKey },
  });
  if (!res.ok) throw new Error(res.status === 401 ? 'Kunci guru salah.' : `Gagal (${res.status})`);
  return res.json();
}
