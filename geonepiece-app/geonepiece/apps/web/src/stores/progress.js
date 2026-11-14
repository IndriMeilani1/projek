import { createStore, useStore } from './createStore';
import { sessionStore, studentKey } from './session';

// Progres belajar per siswa: { "7A.S01": { m2: { step: 3, done: false, explain: "..." } } }
export const progressStore = createStore('progress', {});

export function useModuleProgress(moduleId) {
  const all = useStore(progressStore);
  const key = studentKey(sessionStore.get());
  return all[key]?.[moduleId] ?? { step: 0, done: false };
}

export function useAllProgress() {
  const all = useStore(progressStore);
  return all[studentKey(sessionStore.get())] ?? {};
}

export function updateModuleProgress(moduleId, patch) {
  const key = studentKey(sessionStore.get());
  progressStore.set((all) => {
    const mine = all[key] ?? {};
    const prev = mine[moduleId] ?? { step: 0, done: false };
    return { ...all, [key]: { ...mine, [moduleId]: { ...prev, ...patch } } };
  });
}
