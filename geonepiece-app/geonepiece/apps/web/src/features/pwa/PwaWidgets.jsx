import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '@/components/ui';
import { load, save } from '@/utils/storage';

/** Ajakan memasang aplikasi ke layar utama (Android: tombol; iOS: petunjuk). */
export function InstallPrompt({ hidden }) {
  const [deferred, setDeferred] = useState(null);
  const [dismissed, setDismissed] = useState(() => load('installDismissed', false));
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone;
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const show = !hidden && !dismissed && (deferred || ios);
  const close = () => {
    setDismissed(true);
    save('installDismissed', true);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} className="fixed inset-x-3 bottom-24 z-40 mx-auto flex max-w-md items-center gap-3 rounded-3xl border-2 border-emas-400 bg-laut-900 p-3 text-white shadow-xl md:bottom-6">
          <Icon name="download" />
          <p className="flex-1 text-sm">
            {deferred ? 'Pasang GeOnePiece di HP-mu agar bisa dibuka tanpa internet.' : 'Pasang di iPhone: ketuk tombol Bagikan, lalu "Tambahkan ke Layar Utama".'}
          </p>
          {deferred && (
            <button
              className="btn bg-emas-400 px-3 text-laut-950"
              onClick={async () => {
                deferred.prompt();
                await deferred.userChoice;
                setDeferred(null);
              }}
            >
              Pasang
            </button>
          )}
          <button onClick={close} aria-label="Tutup" className="rounded-full p-1 hover:bg-white/10">
            <Icon name="x" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

export function OfflineBadge() {
  const online = useOnline();
  return (
    <AnimatePresence>
      {!online && (
        <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} className="chip bg-amber-100 text-xs text-amber-900">
          <Icon name="wifiOff" size={14} /> Offline — tetap bisa dipakai
        </motion.span>
      )}
    </AnimatePresence>
  );
}
