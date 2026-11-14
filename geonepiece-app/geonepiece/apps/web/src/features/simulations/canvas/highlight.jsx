import { createContext, useContext, useState } from 'react';

// Interactive highlighting DUA ARAH: ketuk unsur di gambar ↔ simbolnya di rumus menyala.
const HighlightCtx = createContext({ active: null, setActive: () => {} });

export function HighlightProvider({ children }) {
  const [active, setActive] = useState(null);
  return <HighlightCtx.Provider value={{ active, setActive }}>{children}</HighlightCtx.Provider>;
}

export const useHighlightCtx = () => useContext(HighlightCtx);

/** Status sorotan untuk satu unsur (alas | tinggi | diagonal | sisi | potongan). */
export function useHL(id) {
  const { active, setActive } = useContext(HighlightCtx);
  if (!id) return { isActive: false, isDim: false, toggle: () => {} };
  return {
    isActive: active === id,
    isDim: active != null && active !== id,
    toggle: () => setActive((a) => (a === id ? null : id)),
  };
}

export const ELEMENT_NAMES = {
  alas: 'alas',
  tinggi: 'tinggi',
  diagonal: 'diagonal',
  sisi: 'sisi miring',
  potongan: 'potongan',
};
