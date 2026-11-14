import { AnimatePresence, motion } from 'motion/react';
import { useHighlightCtx } from './highlight';
import { fmt } from '@/utils/format';

/**
 * Rumus hidup. tokens = sisi kanan rumus, mis.
 * [{t:'a', el:'alas', v:6}, {t:'×'}, {t:'t', el:'tinggi', v:4}]
 * Simbol berwarna sama dengan unsurnya; ketuk → unsur di gambar menyala.
 */
export function LiveFormula({ tokens, result, unit = 'satuan²', name = 'L' }) {
  const { active, setActive } = useHighlightCtx();
  return (
    <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
      <div className="flex flex-wrap items-baseline gap-x-1.5 text-2xl font-extrabold">
        <span>{name}</span>
        <span>=</span>
        {tokens.map((tk, i) =>
          tk.el ? (
            <button
              key={i}
              type="button"
              onClick={() => setActive((a) => (a === tk.el ? null : tk.el))}
              className={`formula-token ${active === tk.el ? 'scale-110 bg-yellow-100 ring-2 ring-yellow-300' : 'hover:bg-white'}`}
              style={{ color: `var(--color-${tk.el})` }}
              aria-pressed={active === tk.el}
            >
              {tk.t}
            </button>
          ) : (
            <span key={i}>{tk.t}</span>
          ),
        )}
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-lg font-bold text-slate-600">
        <span>=</span>
        {tokens.map((tk, i) =>
          tk.v != null ? (
            <span key={i} style={{ color: tk.el ? `var(--color-${tk.el})` : undefined }}>
              {fmt(tk.v)}
            </span>
          ) : (
            <span key={i}>{tk.t}</span>
          ),
        )}
        <span>=</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={fmt(result)}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className="text-2xl text-laut-700"
          >
            {fmt(result)}
          </motion.span>
        </AnimatePresence>
        <span>{unit}</span>
      </div>
    </div>
  );
}

/** Chip ukuran (alas, tinggi, …) yang juga bisa diketuk untuk menyorot. */
export function MeasureChips({ items }) {
  const { active, setActive } = useHighlightCtx();
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <button
          key={it.label}
          type="button"
          onClick={() => it.el && setActive((a) => (a === it.el ? null : it.el))}
          className={`chip ring-2 transition ${active === it.el ? 'bg-yellow-100 ring-yellow-300' : 'bg-white ring-slate-200'}`}
          style={{ color: it.el ? `var(--color-${it.el})` : undefined }}
        >
          {it.label}: <span className="tabular-nums">{fmt(it.v)}</span>
        </button>
      ))}
    </div>
  );
}

/** Instruksi langkah yang berganti dengan animasi. */
export function Instruction({ children, id }) {
  return (
    <div className="min-h-12" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.p
          key={id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl bg-laut-50 px-4 py-3 font-semibold text-laut-900 ring-1 ring-laut-100"
        >
          {children}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/** Lencana singkat, mis. "Luas tetap!" */
export function Toast({ show, children }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="chip bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SimCard({ title, children }) {
  return (
    <section className="card overflow-hidden">
      {title && <h2 className="px-4 pt-4 text-lg font-extrabold text-laut-900">{title}</h2>}
      <div className="space-y-3 p-4">{children}</div>
    </section>
  );
}
