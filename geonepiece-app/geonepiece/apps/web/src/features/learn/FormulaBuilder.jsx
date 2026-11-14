import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Feedback, Icon } from '@/components/ui';
import { evaluateTokens } from '@/utils/evaluate';

/*
 * "Temukan Rumus": siswa menyusun rumus dari token. Pengecekan dilakukan dengan MENGHITUNG
 * ekspresi siswa pada beberapa nilai acak (bukan mencocokkan teks), sehingga
 * "a × t", "t × a", "½ × a × t", "a × t ÷ 2" semuanya diterima bila setara.
 */
const SAMPLES = [
  { p: 7, l: 3, a: 7, t: 3, b: 4, m: 5, s: 6, 'd₁': 8, 'd₂': 5 },
  { p: 11, l: 5, a: 11, t: 5, b: 2, m: 9, s: 13, 'd₁': 6, 'd₂': 9 },
];

export function FormulaBuilder({ formula, onDone }) {
  const [seq, setSeq] = useState([]);
  const [fb, setFb] = useState(null);
  const color = (tk) => (formula.vars[tk] ? `var(--color-${formula.vars[tk]})` : undefined);

  const check = () => {
    const used = seq.filter((t) => formula.vars[t]);
    if (formula.forbid?.some((f) => used.includes(f))) return setFb({ tone: 'warn', text: formula.forbidMsg });
    const missing = formula.needs.filter((n) => !used.includes(n));
    if (missing.length) return setFb({ tone: 'warn', text: `Rumusmu belum memakai ${missing.join(' dan ')}.` });
    const ok = SAMPLES.every((v) => {
      const toks = seq.map((t) => (t === '½' ? '0.5' : formula.vars[t] ? String(v[t]) : t));
      // "½" diikuti variabel tanpa × → tambahkan × otomatis
      const fixed = toks.flatMap((t, i) => (seq[i] === '½' && seq[i + 1] && seq[i + 1] !== '×' ? [t, '×'] : [t]));
      return Math.abs(evaluateTokens(fixed) - formula.check(v)) < 1e-9;
    });
    if (ok) {
      setFb({ tone: 'ok', text: `Hebat! ${formula.result}. ${formula.note}` });
      onDone?.();
    } else setFb({ tone: 'warn', text: 'Belum tepat. Ingat hasil simulasi tadi: bangun apa yang terbentuk, dan berapa ukurannya?' });
  };

  return (
    <div className="space-y-3">
      <div className="flex min-h-16 flex-wrap items-center gap-1.5 rounded-2xl bg-white p-3 text-2xl font-extrabold ring-2 ring-dashed ring-laut-200" aria-live="polite">
        <span>L =</span>
        <AnimatePresence>
          {seq.map((t, i) => (
            <motion.span key={`${i}-${t}`} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} style={{ color: color(t) }}>
              {t}
            </motion.span>
          ))}
        </AnimatePresence>
        {!seq.length && <span className="text-base font-semibold text-slate-400">ketuk token di bawah…</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {formula.tokens.map((t) => (
          <button
            key={t}
            onClick={() => {
              setSeq((s) => [...s, t]);
              setFb(null);
            }}
            className="min-h-12 min-w-12 rounded-2xl bg-white px-3 text-xl font-extrabold shadow-sm ring-2 ring-slate-200 transition hover:-translate-y-0.5 active:scale-95"
            style={{ color: color(t) }}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="btn-primary" onClick={check} disabled={!seq.length}>
          <Icon name="check" /> Cek rumus
        </button>
        <button className="btn-ghost" onClick={() => setSeq((s) => s.slice(0, -1))} disabled={!seq.length}>
          <Icon name="undo" /> Hapus
        </button>
      </div>
      {fb && <Feedback tone={fb.tone}>{fb.text}</Feedback>}
      <p className="text-sm text-slate-500">
        Keterangan warna: <b style={{ color: 'var(--color-alas)' }}>alas</b> · <b style={{ color: 'var(--color-tinggi)' }}>tinggi</b> · <b style={{ color: 'var(--color-diagonal)' }}>diagonal</b> ·{' '}
        <b style={{ color: 'var(--color-sisi)' }}>sisi</b>
      </p>
    </div>
  );
}
