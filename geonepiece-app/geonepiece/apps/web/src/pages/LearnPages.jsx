import { Suspense } from 'react';
import { getModule, MODULES } from '@/content/modules';
import { ModuleFlow, SimFallback } from '@/features/learn/ModuleFlow';
import { SIMULATIONS } from '@/features/simulations/registry';
import { useAllProgress } from '@/stores/progress';
import { Link } from '@/app/router';
import { PageHeader, ProgressBar } from '@/components/ui';
import { ShapeIcon } from '@/components/ui/ShapeIcon';
import QuadVenn from '@/features/venn/QuadVenn';

export function LearnPage() {
  const progress = useAllProgress();
  return (
    <div>
      <PageHeader title="Belajar" subtitle="Setiap modul: pemantik → simulasi → rumus → contoh → latihan → refleksi" />
      <div className="space-y-3">
        {MODULES.map((m) => {
          const p = progress[m.id];
          return (
            <Link key={m.id} to={`/belajar/${m.id}`} className="card flex items-center gap-4 p-4 transition hover:shadow-md">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-laut-100 ring-2 ring-laut-200"><ShapeIcon shape={m.shape} size={36} fill={`${m.color}40`} stroke={m.color} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: m.color }}>
                  M{m.no} · {m.island}
                </p>
                <p className="font-extrabold">{m.title}</p>
                <ProgressBar value={p?.done ? 1 : (p?.step ?? 0) / 6} className="mt-2" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function ModulePage({ params }) {
  const module = getModule(params.id);
  if (!module) return <PageHeader title="Modul tidak ditemukan" back="/belajar" />;
  return (
    <div>
      <PageHeader title={module.title} subtitle={`${module.island} · ±${module.minutes} menit`} back="/belajar" />
      <ModuleFlow key={module.id} module={module} />
    </div>
  );
}

export function LabPage({ params }) {
  const sim = params?.id ? SIMULATIONS[params.id] : null;
  if (sim) {
    const Sim = sim.Component;
    return (
      <div>
        <PageHeader title={sim.title} subtitle="Laboratorium bebas" back="/lab" />
        <Suspense fallback={<SimFallback />}>
          <Sim />
        </Suspense>
      </div>
    );
  }
  return (
    <div>
      <PageHeader title="Laboratorium" subtitle="Semua simulasi, bebas dicoba kapan saja." />
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.values(SIMULATIONS).map((s) => (
          <Link key={s.id} to={`/lab/${s.id}`} className="card flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
            <ShapeIcon shape={s.shape} size={44} />
            <span>
              <b className="block">{s.title}</b>
              <span className="text-sm text-slate-600">{s.desc}</span>
            </span>
          </Link>
        ))}
        <Link to="/peta" className="card flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
          <ShapeIcon shape="belah-ketupat" size={44} fill="#ede9fe" stroke="#7c3aed" />
          <span>
            <b className="block">Peta Keluarga Segiempat</b>
            <span className="text-sm text-slate-600">Diagram Venn interaktif.</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export function MapPage() {
  return (
    <div>
      <PageHeader title="Peta Keluarga Segiempat" subtitle="Kenali bangunnya dulu, baru pilih rumusnya." back="/" />
      <QuadVenn />
    </div>
  );
}
