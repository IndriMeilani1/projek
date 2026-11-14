import { useCallback, useEffect, useRef } from 'react';
import { animate } from 'motion/react';

/**
 * Menganimasikan nilai 0 → 1 dengan Motion, lalu memanggil onUpdate(t) tiap frame.
 * Cocok untuk transformasi geometri (geser/putar) yang titik-titiknya dihitung ulang.
 */
export function useTween() {
  const ctrl = useRef(null);
  useEffect(() => () => ctrl.current?.stop?.(), []);

  return useCallback((transition, onUpdate, onComplete) => {
    ctrl.current?.stop?.();
    ctrl.current = animate(0, 1, { ...transition, onUpdate, onComplete });
  }, []);
}
