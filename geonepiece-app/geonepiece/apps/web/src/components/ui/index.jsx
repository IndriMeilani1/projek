import { useId } from 'react';
import { motion } from 'motion/react';
import { Icon } from './Icon';
import { Link } from '@/app/router';

export { Icon };

export function PageHeader({ title, subtitle, back, right }) {
  return (
    <header className="mb-4 flex items-start gap-3">
      {back && (
        <Link to={back} className="btn -ml-1 size-11 shrink-0 rounded-full bg-laut-900 p-0 text-emas-300 ring-2 ring-emas-400 hover:bg-laut-800" aria-label="Kembali">
          <Icon name="arrowLeft" />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-3xl leading-tight text-laut-900 md:text-4xl">{title}</h1>
        <div className="rope mt-1 w-16" aria-hidden="true" />
        {subtitle && <p className="mt-1.5 text-slate-600">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

/** Slider besar yang ramah jari, berwarna sesuai unsur bangun. */
export function Slider({ label, value, min, max, step = 1, onChange, el, suffix = '' }) {
  const color = el ? `var(--color-${el})` : 'var(--color-merah-600)';
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-sm font-bold" style={{ color }}>
        <span>{label}</span>
        <span className="tabular-nums">
          {String(value).replace('.', ',')}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 w-full cursor-pointer"
        style={{ accentColor: color }}
      />
    </label>
  );
}

export function ProgressBar({ value, className = '' }) {
  return (
    <div className={`h-3 w-full overflow-hidden rounded-full bg-kertas-200 ring-1 ring-kertas-300 ${className}`}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-emas-400 to-merah-500"
        initial={false}
        animate={{ width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  );
}

/** Kotak umpan balik dengan animasi muncul. tone: ok | warn | info */
export function Feedback({ tone = 'info', children }) {
  const styles = {
    ok: 'bg-emerald-50 text-emerald-900 ring-emerald-300',
    warn: 'bg-emas-50 text-kertas-900 ring-emas-300',
    info: 'bg-laut-50 text-laut-900 ring-laut-200',
  };
  const icon = { ok: 'check', warn: 'bulb', info: 'sparkles' }[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 rounded-2xl p-3 ring-1 ${styles[tone]} ${tone === 'warn' ? 'animate-shake' : ''}`}
      role="status"
    >
      <Icon name={icon} className="mt-0.5 shrink-0" />
      <div className="min-w-0">{children}</div>
    </motion.div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  const group = useId();
  return (
    <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1.5" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={`relative min-h-11 shrink-0 rounded-2xl px-4 py-2 font-extrabold transition ${
            value === t.id ? 'text-white' : 'bg-kertas-50 text-slate-600 ring-1 ring-kertas-300 hover:bg-white'
          }`}
        >
          {value === t.id && (
            <motion.span layoutId={`tab-pill-${group}`} className="absolute inset-0 rounded-2xl bg-merah-500 shadow-[0_3px_0_var(--color-merah-700)]" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
          )}
          <span className="relative">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
