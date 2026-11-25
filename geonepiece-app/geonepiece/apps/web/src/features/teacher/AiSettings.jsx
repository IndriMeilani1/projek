import { useState } from 'react';
import { Feedback } from '@/components/ui';
import { AiError, chat, GROQ_MODEL, hasDeviceGroqKey, isAiEnabled, setDeviceGroqKey } from '@/services/groq';

/** Mode Guru → Pengaturan: Groq key for THIS device + a connection test. */
export function AiSettings() {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState(null);
  const [onDevice, setOnDevice] = useState(hasDeviceGroqKey());

  const test = async () => {
    setStatus({ tone: 'info', text: 'Menguji koneksi…' });
    try {
      const r = await chat([{ role: 'user', content: 'Balas dengan satu kata: siap' }], { maxTokens: 200 });
      setStatus({ tone: 'ok', text: `Tersambung ke Groq (${GROQ_MODEL}). Balasan: "${r.slice(0, 40)}"` });
    } catch (e) {
      const kind = e instanceof AiError ? e.kind : 'error';
      const msg = { disabled: 'Kunci belum diisi atau tidak valid.', offline: 'Perangkat sedang offline.', busy: 'Batas kuota sementara tercapai. Coba lagi sebentar.' }[kind];
      setStatus({ tone: 'warn', text: msg ?? `Gagal: ${e.message}` });
    }
  };

  return (
    <div className="card max-w-md space-y-3 p-5">
      <h2 className="font-extrabold text-laut-900">Tutor RMT (AI Groq)</h2>
      <p className="text-sm text-slate-600">
        Status: <b>{isAiEnabled() ? `aktif · model ${GROQ_MODEL}` : 'tidak aktif (siswa memakai pertanyaan penuntun bawaan)'}</b>
        {onDevice && ' · kunci tersimpan di perangkat ini'}
      </p>
      <input className="input font-mono text-sm" type="password" autoComplete="off" placeholder="gsk_… (kunci API Groq)" value={key} onChange={(e) => setKey(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <button
          className="btn-primary"
          disabled={!key.trim().startsWith('gsk_')}
          onClick={() => {
            setDeviceGroqKey(key);
            setKey('');
            setOnDevice(true);
            setStatus({ tone: 'ok', text: 'Kunci disimpan di perangkat ini.' });
          }}
        >
          Simpan di perangkat ini
        </button>
        {onDevice && (
          <button
            className="btn-ghost"
            onClick={() => {
              setDeviceGroqKey('');
              setOnDevice(false);
              setStatus({ tone: 'info', text: 'Kunci di perangkat ini dihapus.' });
            }}
          >
            Hapus kunci
          </button>
        )}
        <button className="btn-soft" onClick={test} disabled={!isAiEnabled()}>
          Uji koneksi
        </button>
      </div>
      {status && <Feedback tone={status.tone}>{status.text}</Feedback>}
      <p className="text-xs text-slate-500">
        Kunci hanya berlaku di HP/laptop ini (bisa dipakai di HP siswa saat uji coba). Siapa pun yang memegang perangkat dapat membacanya, jadi pakai kunci khusus penelitian
        dan hapus atau ganti kunci setelah penelitian selesai. Pemilik akun Groq harus berusia 18 tahun ke atas.
      </p>
    </div>
  );
}
