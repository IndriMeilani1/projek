import { useSyncExternalStore } from 'react';
import { load, save } from '@/utils/storage';

/** Store kecil yang otomatis tersimpan di localStorage (pengganti Zustand untuk MVP). */
export function createStore(key, initial) {
  let state = load(key, initial);
  const subs = new Set();
  return {
    get: () => state,
    set(updater) {
      state = typeof updater === 'function' ? updater(state) : updater;
      save(key, state);
      subs.forEach((fn) => fn());
    },
    reload() {
      state = load(key, initial);
      subs.forEach((fn) => fn());
    },
    subscribe(fn) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
}

export function useStore(store) {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
