import { useState } from 'react';
import { motion } from 'motion/react';
import { evaluateText } from '@/utils/evaluate';
import { fmt } from '@/utils/format';
import { Icon } from '@/components/ui';

// Kalkulator di layar (temuan IL04: angka besar menghambat). Tanpa eval().
const KEYS = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', ',', '(', '+', ')'];

export function Calculator({ onClose }) {
  const [expr, setExpr] = useState('');
  const [hist, setHist] = useState([]);
  const value = evaluateText(expr);

  const press = (k) => setExpr((e) => e + k);
  const equals = () => {
    if (!Number.isNaN(value)) {
      setHist((h) => [`${expr} = ${fmt(value)}`, ...h].slice(0, 4));
      setExpr(String(Math.round(value * 1e6) / 1e6).replace('.', ','));
    }
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      className="fixed inset-x-2 bottom-2 z-40 mx-auto max-w-sm rounded-3xl bg-slate-900 p-3 text-white shadow-2xl sm:right-4 sm:left-auto"
      role="dialog"
      aria-label="Kalkulator"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-300">Kalkulator</span>
        <button onClick={onClose} className="rounded-full p-1 hover:bg-white/10" aria-label="Tutup kalkulator">
          <Icon name="x" />
        </button>
      </div>
      <div className="mb-2 rounded-2xl bg-slate-800 p-3 text-right">
        {hist.map((h, i) => (
          <div key={i} className="truncate text-xs text-slate-400">
            {h}
          </div>
        ))}
        <div className="min-h-8 break-all text-2xl font-bold tabular-nums">{expr || '0'}</div>
        <div className="h-5 text-sm text-emerald-300 tabular-nums">{expr && !Number.isNaN(value) ? `= ${fmt(value)}` : ''}</div>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        <button className="calc-key bg-rose-500/80" onClick={() => setExpr('')}>
          C
        </button>
        <button className="calc-key bg-slate-700" onClick={() => setExpr((e) => e.slice(0, -1))} aria-label="Hapus satu">
          ⌫
        </button>
        {KEYS.map((k) => (
          <button key={k} className={`calc-key ${'÷×−+'.includes(k) ? 'bg-laut-600' : 'bg-slate-700'}`} onClick={() => press(k)}>
            {k}
          </button>
        ))}
        <button className="calc-key col-span-3 bg-emerald-500 text-slate-900" onClick={equals}>
          =
        </button>
      </div>
      <style>{`.calc-key{min-height:46px;border-radius:14px;font-size:1.25rem;font-weight:800}.calc-key:active{transform:scale(.95)}`}</style>
    </motion.div>
  );
}
