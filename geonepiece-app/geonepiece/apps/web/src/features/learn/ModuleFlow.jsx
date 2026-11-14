import { Suspense, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SIMULATIONS } from '@/features/simulations/registry';
import { WorkedExample } from './WorkedExample';
import { FormulaBuilder } from './FormulaBuilder';
import { PracticeSet } from '@/features/practice/PracticeItem';
import { GENERATORS } from '@/content/modules';
import { updateModuleProgress, useModuleProgress } from '@/stores/progress';
import { Feedback, Icon, ProgressBar } from '@/components/ui';
import { stepVariants } from '@/motion/springs';
import { navigate } from '@/app/router';

const STEPS = [
  { id: 'pemantik', label: 'Pemantik', icon: 'bulb' },
  { id: 'simulasi', label: 'Simulasi', icon: 'scissors' },
  { id: 'rumus', label: 'Rumus', icon: 'sparkles' },
  { id: 'contoh', label: 'Contoh', icon: 'book' },
  { id: 'latihan', label: 'Latihan', icon: 'target' },
  { id: 'refleksi', label: 'Refleksi', icon: 'pencil' },
];

export const SimFallback = () => <div className="card grid h-72 animate-pulse place-items-center text-slate-400">Memuat simulasi…</div>;

/** Alur 6 langkah satu modul. Langkah dikendalikan siswa (learner-paced). */
export function ModuleFlow({ module }) {
  const progress = useModuleProgress(module.id);
  const [step, setStep] = useState(Math.min(progress.step ?? 0, STEPS.length - 1));
  const [dir, setDir] = useState(1);

  const go = (n) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
    updateModuleProgress(module.id, { step: Math.max(n, progress.step ?? 0) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      <nav className="card p-3" aria-label="Langkah modul">
        <ProgressBar value={(step + 1) / STEPS.length} className="mb-3" />
        <ol className="no-scrollbar flex gap-1 overflow-x-auto">
          {STEPS.map((s, i) => (
            <li key={s.id} className="shrink-0">
              <button
                onClick={() => go(i)}
                className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-sm font-bold transition ${i === step ? 'bg-laut-700 text-white' : i < step ? 'text-laut-700' : 'text-slate-400'}`}
                aria-current={i === step ? 'step' : undefined}
              >
                <Icon name={i < step ? 'check' : s.icon} size={16} />
                {s.label}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={step} custom={dir} variants={stepVariants} initial="initial" animate="animate" exit="exit">
          <StepBody id={STEPS[step].id} module={module} />
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between gap-2">
        <button className="btn-ghost" onClick={() => go(step - 1)} disabled={step === 0}>
          <Icon name="arrowLeft" /> Kembali
        </button>
        {step < STEPS.length - 1 ? (
          <button className="btn-primary" onClick={() => go(step + 1)}>
            Lanjut <Icon name="arrowRight" />
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => {
              updateModuleProgress(module.id, { done: true, step: STEPS.length - 1 });
              navigate('/belajar');
            }}
          >
            <Icon name="check" /> Selesaikan modul
          </button>
        )}
      </div>
    </div>
  );
}

function StepBody({ id, module }) {
  switch (id) {
    case 'pemantik':
      return <Pemantik module={module} />;
    case 'simulasi': {
      const Sim = SIMULATIONS[module.sim].Component;
      return (
        <Suspense fallback={<SimFallback />}>
          <Sim />
        </Suspense>
      );
    }
    case 'rumus':
      return (
        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold text-laut-900">Temukan rumusnya</h2>
          {module.formula ? (
            <>
              <p className="text-slate-600">Berdasarkan simulasi tadi, susun rumus luas {module.title.toLowerCase()} dari token berikut.</p>
              <FormulaBuilder formula={module.formula} />
            </>
          ) : (
            <ul className="space-y-2">
              {module.keyIdea.map((k) => (
                <li key={k} className="rounded-2xl bg-laut-50 p-3 text-lg font-bold text-laut-900 ring-1 ring-laut-100">
                  💡 {k}
                </li>
              ))}
            </ul>
          )}
        </section>
      );
    case 'contoh':
      return (
        <section className="card space-y-3 p-4">
          <h2 className="text-xl font-extrabold text-laut-900">Contoh langkah demi langkah</h2>
          <WorkedExample example={module.example} />
        </section>
      );
    case 'latihan':
      return (
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-laut-900">Latihan</h2>
          <PracticeSet items={module.practice} generator={GENERATORS[module.id]} />
        </section>
      );
    case 'refleksi':
      return <Reflection module={module} />;
    default:
      return null;
  }
}

function Pemantik({ module }) {
  const [pick, setPick] = useState(null);
  const p = module.pemantik;
  return (
    <section className="card space-y-3 p-4">
      <h2 className="text-xl font-extrabold text-laut-900">Coba tebak dulu!</h2>
      <p className="rounded-2xl bg-pasir-100 p-4 text-lg font-semibold text-amber-950">{p.text}</p>
      <p className="font-bold">{p.question}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {p.options.map((o) => (
          <button key={o} onClick={() => setPick(o)} className={`rounded-2xl p-3 text-left font-bold ring-2 transition ${pick === o ? 'bg-yellow-50 ring-yellow-400' : 'bg-white ring-slate-200 hover:ring-laut-200'}`}>
            {o}
          </button>
        ))}
      </div>
      {pick && (
        <Feedback tone="info">
          Kamu memilih <b>{pick}</b>. {p.insight}
        </Feedback>
      )}
    </section>
  );
}

function Reflection({ module }) {
  const progress = useModuleProgress(module.id);
  const [text, setText] = useState(progress.explain ?? '');
  const [saved, setSaved] = useState(false);
  return (
    <section className="card space-y-3 p-4">
      <h2 className="text-xl font-extrabold text-laut-900">Jelaskan ke teman</h2>
      <p className="text-slate-600">{module.explainPrompt}</p>
      <textarea className="input min-h-32 text-base" value={text} onChange={(e) => { setText(e.target.value); setSaved(false); }} placeholder="Tulis penjelasanmu dengan kata-katamu sendiri…" />
      <button
        className="btn-soft"
        onClick={() => {
          updateModuleProgress(module.id, { explain: text });
          setSaved(true);
        }}
        disabled={!text.trim()}
      >
        <Icon name="check" /> Simpan penjelasan
      </button>
      {saved && <Feedback tone="ok">Penjelasanmu tersimpan. Menjelaskan kepada orang lain adalah cara terbaik untuk memahami!</Feedback>}
      <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <p className="flex items-center gap-2 font-bold text-slate-700">
          <Icon name="play" /> Video singkat
        </p>
        {module.video ? (
          <video src={module.video} controls preload="none" className="mt-2 w-full rounded-xl" />
        ) : (
          <p className="mt-1 text-sm text-slate-500">Video untuk modul ini belum ditambahkan. (Guru/pengembang: isi kolom <code>video</code> di content/modules.js.)</p>
        )}
      </div>
    </section>
  );
}
