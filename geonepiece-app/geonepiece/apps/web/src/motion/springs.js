// Preset animasi bersama. Jangan menulis angka pegas baru di komponen — tambahkan di sini.
export const springs = {
  detach: { type: 'spring', stiffness: 300, damping: 22 },
  snap: { type: 'spring', stiffness: 500, damping: 30 },
  return: { type: 'spring', stiffness: 200, damping: 20 },
  turn: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
  gentle: { duration: 0.25, ease: 'easeOut' },
};

export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export const stepVariants = {
  initial: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.18 } }),
};

/** Getar halus saat potongan menempel (bila perangkat mendukung). */
export function haptic(ms = 18) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* abaikan */
  }
}
