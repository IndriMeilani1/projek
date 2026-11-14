import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Feedback, Icon } from '@/components/ui';
import { parseNumberId } from '@/utils/format';

/*
 * Contoh soal langkah demi langkah (temuan DS02: "dijelaskan pelan-pelan").
 * Siswa yang menekan "Langkah berikutnya" — tidak ada auto-play.
 * Setelah semua langkah: soal "faded" (siswa mengerjakan sendiri).
 */
export function WorkedExample({ example, onDone }) {
  const [shown, setShown] = useState(1);
  const [ans, setAns] = useState('');
  const [fb, setFb] = useState(null);
  const all = shown >= example.steps.length;

  const check = () => {
    const v = parseNumberId(ans);
    const f = example.faded;
    if (Math.abs(v - f.answer) <= (f.tol ?? 0.01)) {
      setFb({ tone: 'ok', text: `Tepat! ${f.answer.toLocaleString('id-ID')} ${f.unit}.` });
      onDone?.();
    } else {
      const m = f.wrong?.find((w) => Math.abs(w.value - v) < 0.01);
      setFb({ tone: 'warn', text: m ? m.msg : 'Belum tepat. Lihat lagi langkah-langkah contoh di atas.' });
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-pasir-100 p-4 font-semibold text-amber-950">{example.context}</div>
      <ol className="space-y-2">
        <AnimatePresence initial={false}>
          {example.steps.slice(0, shown).map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className={`flex gap-3 rounded-2xl p-3 ring-1 ${i === shown - 1 ? 'bg-white ring-laut-500 shadow-md' : 'bg-white/70 ring-slate-200'}`}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-laut-700 font-extrabold text-white">{i + 1}</span>
              <div>
                <p className="font-semibold">{s.text}</p>
                <p className="mt-1 font-mono text-lg font-bold text-laut-900">{s.calc}</p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      {!all ? (
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => setShown((n) => n + 1)}>
            Langkah berikutnya <Icon name="arrowRight" />
          </button>
          {shown > 1 && (
            <button className="btn-ghost" onClick={() => setShown((n) => n - 1)}>
              Ulangi langkah
            </button>
          )}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-3 p-4">
          <p className="font-bold text-laut-900">✏️ {example.faded.prompt}</p>
          <div className="flex gap-2">
            <input className="input" inputMode="decimal" value={ans} onChange={(e) => setAns(e.target.value)} placeholder="Jawabanmu" aria-label="Jawaban" />
            <span className="self-center font-bold text-slate-500">{example.faded.unit}</span>
          </div>
          <button className="btn-primary" onClick={check} disabled={!ans.trim()}>
            Cek
          </button>
          {fb && <Feedback tone={fb.tone}>{fb.text}</Feedback>}
        </motion.div>
      )}
    </div>
  );
}
