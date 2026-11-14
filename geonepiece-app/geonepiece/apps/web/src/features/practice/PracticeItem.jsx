import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ProblemReader, checkMarks } from './ProblemReader';
import { Feedback, Icon } from '@/components/ui';
import { parseNumberId } from '@/utils/format';

/*
 * Satu soal latihan: Pembaca Soal (dengan umpan balik) + jawaban numerik
 * + petunjuk bertingkat (arah → strategi → hampir jawaban) + umpan balik berbasis miskonsepsi.
 */
export function PracticeItem({ item, index, onSolved, onSimilar }) {
  const [marks, setMarks] = useState({});
  const [markFb, setMarkFb] = useState(null);
  const [ans, setAns] = useState('');
  const [hints, setHints] = useState(0);
  const [fb, setFb] = useState(null);
  const [solved, setSolved] = useState(false);
  const [tries, setTries] = useState(0);

  const check = () => {
    const v = parseNumberId(ans);
    setTries((t) => t + 1);
    if (Number.isNaN(v)) return setFb({ tone: 'warn', text: 'Tuliskan jawabanmu berupa angka, misalnya 24 atau 7,5.' });
    if (Math.abs(v - item.answer) <= (item.tol ?? 0.01)) {
      setSolved(true);
      setFb({ tone: 'ok', text: `Benar! Jawabannya ${item.answer.toLocaleString('id-ID')} ${item.unit}.` });
      onSolved?.(item.id, { tries: tries + 1, hints });
      return;
    }
    const mis = item.misconceptions?.find((m) => Math.abs(m.value - v) < 0.01);
    setFb({ tone: 'warn', text: mis ? mis.msg : tries >= 1 ? 'Belum tepat. Coba buka petunjuk.' : 'Belum tepat. Periksa lagi langkahmu.' });
  };

  return (
    <article className={`card space-y-3 p-4 ${solved ? 'ring-2 ring-emerald-300' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="chip bg-laut-100 text-laut-900">Soal {index + 1}</span>
        {solved && <span className="chip animate-pop bg-emerald-100 text-emerald-800">✓ Selesai</span>}
      </div>
      <ProblemReader sentences={item.sentences} marks={marks} onChange={(m) => { setMarks(m); setMarkFb(null); }} />
      <button className="btn-ghost px-2 text-sm" onClick={() => setMarkFb(checkMarks(item.sentences, marks))}>
        <Icon name="eye" size={18} /> Cek sorotanku
      </button>
      {markFb && <Feedback tone={markFb.ok ? 'ok' : 'info'}>{markFb.msg}</Feedback>}

      <div className="flex items-center gap-2">
        <input
          className="input"
          inputMode="decimal"
          value={ans}
          onChange={(e) => setAns(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ans.trim() && !solved && check()}
          placeholder="Jawabanmu"
          disabled={solved}
          aria-label={`Jawaban soal ${index + 1}`}
        />
        <span className="shrink-0 font-bold text-slate-500">{item.unit}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={check} disabled={!ans.trim() || solved}>
          Cek jawaban
        </button>
        {!solved && hints < item.hints.length && (
          <button className="btn-warn" onClick={() => setHints((h) => h + 1)}>
            <Icon name="bulb" /> Petunjuk {hints + 1}
          </button>
        )}
        {solved && onSimilar && (
          <button className="btn-soft" onClick={onSimilar}>
            <Icon name="sparkles" /> Soal mirip
          </button>
        )}
      </div>
      <AnimatePresence>
        {item.hints.slice(0, hints).map((h, i) => (
          <motion.p key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-xl bg-amber-50 px-3 py-2 text-amber-900 ring-1 ring-amber-200">
            <b>Petunjuk {i + 1}:</b> {h}
          </motion.p>
        ))}
      </AnimatePresence>
      {fb && <Feedback tone={fb.tone}>{fb.text}</Feedback>}
    </article>
  );
}

/** Kumpulan soal + generator "soal mirip". */
export function PracticeSet({ items, generator, onAllSolved }) {
  const [list, setList] = useState(items);
  const [solved, setSolved] = useState(() => new Set());
  const reported = useRef(false);

  useEffect(() => {
    if (!reported.current && items.every((it) => solved.has(it.id))) {
      reported.current = true;
      onAllSolved?.();
    }
  }, [solved, items, onAllSolved]);

  const addSimilar = () =>
    setList((l) => {
      const g = generator();
      return [...l, { ...g, id: `${g.id}-${l.length}` }];
    });

  return (
    <div className="space-y-3">
      {list.map((it, i) => (
        <motion.div key={it.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <PracticeItem item={it} index={i} onSolved={(id) => setSolved((s) => new Set(s).add(id))} onSimilar={generator ? addSimilar : undefined} />
        </motion.div>
      ))}
      <p className="text-center text-sm font-bold text-slate-500">{solved.size} soal selesai</p>
    </div>
  );
}
