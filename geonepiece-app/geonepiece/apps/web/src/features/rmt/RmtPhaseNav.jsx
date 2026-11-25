import { Icon } from '@/components/ui';
import { RMT_PHASES } from '@/content/rmt';

/** Stepper of the four RMT phases. Students may go back freely; forward only to unlocked phases. */
export function RmtPhaseNav({ current, unlocked, onChange }) {
  return (
    <nav aria-label="Fase berpikir RMT">
      <ol className="grid grid-cols-4 gap-1.5">
        {RMT_PHASES.map((p, i) => {
          const active = i === current;
          const open = i <= unlocked;
          const done = i < unlocked && !active;
          return (
            <li key={p.id}>
              <button
                type="button"
                disabled={!open}
                onClick={() => onChange(i)}
                aria-current={active ? 'step' : undefined}
                className={`flex min-h-14 w-full flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 text-center text-[0.7rem] font-extrabold leading-tight ring-2 transition sm:flex-row sm:gap-1.5 sm:text-sm ${
                  active
                    ? 'bg-merah-500 text-white ring-merah-600 shadow-[0_3px_0_var(--color-merah-700)]'
                    : done
                      ? 'bg-emas-100 text-kertas-900 ring-emas-300'
                      : open
                        ? 'bg-kertas-50 text-slate-600 ring-kertas-300 hover:bg-white'
                        : 'bg-kertas-100 text-slate-400 ring-kertas-200'
                }`}
              >
                <span className="grid size-6 place-items-center rounded-full bg-black/10 text-xs">{done ? <Icon name="check" size={14} /> : p.no}</span>
                <span>{p.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
