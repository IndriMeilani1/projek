import { createStore, useStore } from './createStore';

// Identitas siswa = kode kelas + kode siswa. Tidak ada nama, email, atau nomor HP.
export const sessionStore = createStore('session', null);

export const normalizeCode = (s) => String(s ?? '').trim().toUpperCase().replace(/\s+/g, '');

export function login({ classCode, studentCode }) {
  sessionStore.set({
    classCode: normalizeCode(classCode),
    studentCode: normalizeCode(studentCode),
    since: new Date().toISOString(),
  });
}

export function logout() {
  sessionStore.set(null);
}

export const useSession = () => useStore(sessionStore);
export const studentKey = (s) => (s ? `${s.classCode}.${s.studentCode}` : 'tamu');
