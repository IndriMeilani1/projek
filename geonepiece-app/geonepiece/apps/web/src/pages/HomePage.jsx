import { motion } from 'motion/react';
import { MODULES } from '@/content/modules';
import { useAllProgress } from '@/stores/progress';
import { useSession } from '@/stores/session';
import { useAttempt } from '@/features/assessment/attempts';
import { Link } from '@/app/router';
import { Icon } from '@/components/ui';
import { ShapeIcon } from '@/components/ui/ShapeIcon';
import { WantedPoster } from '@/components/ui/WantedPoster';
import { LogPose } from '@/components/ui/LogPose';
import { bountyFor, compassAngle } from '@/utils/bounty';

// 7 kepingan tangram = 7 modul. Kepingan berwarna saat modul selesai.
const TANGRAM = [
  '0,0 4,0 2,2',
  '0,0 2,2 0,4',
  '4,4 2,4 4,2',
  '2,2 3,3 2,4 1,3',
  '2,2 3,1 3,3',
  '3,1 4,0 4,2 3,3',
  '0,4 1,3 2,4',
];

export default function HomePage() {
  const session = useSession();
  const progress = useAllProgress();
  const pre = useAttempt(session, 'pre');
  const post = useAttempt(session, 'post');
  const done = MODULES.filter((m) => progress[m.id]?.done).length;
  const testsSubmitted = [pre, post].filter((a) => a?.status === 'submitted').length;
  const nextIndex = MODULES.findIndex((m) => !progress[m.id]?.done);
  const next = nextIndex >= 0 ? MODULES[nextIndex] : null;

  return (
    <div className="space-y-6">
      <section className="sea relative overflow-hidden rounded-3xl p-5 text-white ring-4 ring-emas-500/80 sm:p-6">
        <Waves />
        <div className="relative grid items-center gap-6 md:grid-cols-[17rem_1fr]">
          <WantedPoster name={session.studentCode} caption={`ARMADA KELAS ${session.classCode}`} bounty={bountyFor({ modulesDone: done, testsSubmitted })}>
            <svg viewBox="-0.2 -0.2 4.4 4.4" className="h-full max-h-36 w-auto" aria-label={`${done} dari 7 kepingan peta terkumpul`}>
              {TANGRAM.map((pts, i) => (
                <polygon
                  key={i}
                  points={pts}
                  fill={progress[MODULES[i].id]?.done ? MODULES[i].color : 'rgba(255,255,255,0.12)'}
                  style={{ transition: 'fill 600ms ease' }}
                  stroke="#fae08a"
                  strokeWidth="0.06"
                  strokeLinejoin="round"
                />
              ))}
            </svg>
          </WantedPoster>

          <div className="space-y-4 text-center md:text-left">
            <div>
              <p className="text-sm font-extrabold tracking-wide text-emas-300">Ahoy, {session.studentCode}!</p>
              <h1 className="font-display text-3xl leading-tight text-white drop-shadow-[0_2px_0_rgb(0_0_0/0.4)] sm:text-4xl">
                Kumpulkan 7 kepingan peta harta di pulau-pulau bangun datar
              </h1>
            </div>
            <div className="mx-auto flex max-w-xs items-center gap-2 md:mx-0" aria-hidden="true">
              {MODULES.map((m) => (
                <span key={m.id} className={`h-2.5 flex-1 rounded-full ${progress[m.id]?.done ? 'bg-emas-400' : 'bg-white/15'}`} />
              ))}
            </div>
            <p className="text-sm font-bold text-laut-100">{done} dari 7 kepingan terkumpul</p>

            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 sm:flex-row md:items-center">
              <LogPose angle={compassAngle(Math.max(0, nextIndex))} size={96} label={next ? `Kompas menunjuk ke ${next.island}` : 'Semua pulau sudah dijelajahi'} />
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-extrabold uppercase tracking-widest text-emas-300">Kompas menunjuk ke</p>
                <p className="font-display text-2xl leading-tight">{next ? next.island : 'Semua pulau tertaklukkan!'}</p>
                {next && <p className="text-sm text-laut-100">{next.title}</p>}
                <Link to={next ? `/belajar/${next.id}` : '/latihan'} className="btn-primary mt-2 w-full sm:w-auto">
                  {next ? 'Berlayar sekarang' : 'Asah kemampuan'} <Icon name="arrowRight" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <TestCard kind="pre" attempt={pre} />
        <TestCard kind="post" attempt={post} />
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl leading-none text-laut-900 sm:text-3xl">Peta Petualangan</h2>
            <div className="rope mt-1 w-20" aria-hidden="true" />
          </div>
          <span className="chip bg-laut-900 text-xs text-emas-300">7 pulau</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {MODULES.map((m, i) => {
            const p = progress[m.id];
            const isNext = next?.id === m.id;
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link
                  to={`/belajar/${m.id}`}
                  className={`card relative flex h-full flex-col gap-2 p-4 transition hover:-translate-y-0.5 hover:shadow-lg ${isNext ? 'ring-2 ring-merah-500' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="relative grid size-12 place-items-center rounded-full bg-laut-100 ring-2 ring-laut-200">
                      <ShapeIcon shape={m.shape} size={32} fill={`${m.color}40`} stroke={m.color} />
                    </span>
                    {p?.done ? (
                      <span className="chip bg-emas-400 text-xs text-laut-950 shadow-[0_2px_0_var(--color-emas-700)]">✦ Harta</span>
                    ) : isNext ? (
                      <span className="chip bg-merah-500 text-xs text-white">⚑ Tujuan</span>
                    ) : (
                      <span className="font-display text-xl text-kertas-500">#{m.no}</span>
                    )}
                  </div>
                  <span className="text-xs font-black uppercase tracking-wide" style={{ color: m.color }}>
                    {m.island}
                  </span>
                  <span className="font-extrabold leading-tight">{m.title}</span>
                  <span className="mt-auto flex items-center gap-1 text-xs font-bold text-slate-500">
                    <Icon name="clock" size={14} /> ±{m.minutes} menit
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Link to="/peta" className="card flex items-center gap-3 p-4 transition hover:shadow-lg">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-laut-900 text-emas-300 ring-2 ring-emas-400">
          <Icon name="map" />
        </span>
        <span className="flex-1">
          <b className="block">Peta Keluarga Segiempat</b>
          <span className="text-sm text-slate-600">Diagram Venn interaktif: kenali bangunnya dulu, baru pilih rumusnya.</span>
        </span>
        <Icon name="arrowRight" />
      </Link>
    </div>
  );
}

function TestCard({ kind, attempt }) {
  const submitted = attempt?.status === 'submitted';
  const status = !attempt ? 'Belum dikerjakan' : submitted ? 'Sudah dikumpulkan' : 'Sedang dikerjakan';
  return (
    <Link to={`/tes/${kind}`} className="card flex items-center gap-3 p-4 transition hover:shadow-lg">
      <span
        className={`grid size-12 shrink-0 place-items-center rounded-2xl ring-2 ${submitted ? 'bg-emas-400 text-laut-950 ring-emas-600' : 'bg-merah-50 text-merah-600 ring-merah-100'}`}
      >
        <Icon name={submitted ? 'check' : 'lock'} />
      </span>
      <span className="flex-1">
        <b className="block font-display text-xl font-normal leading-tight text-laut-900">{kind === 'pre' ? 'Pretest' : 'Posttest'}</b>
        <span className="text-sm text-slate-600">{status}</span>
      </span>
      <Icon name="arrowRight" />
    </Link>
  );
}

/** Ombak dekoratif di dasar hero. */
function Waves() {
  return (
    <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full opacity-30" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 30 Q25 18 50 30 T100 30 T150 30 T200 30 T250 30 T300 30 T350 30 T400 30 V60 H0Z" fill="#2b7bb9" />
      <path d="M0 42 Q25 32 50 42 T100 42 T150 42 T200 42 T250 42 T300 42 T350 42 T400 42 V60 H0Z" fill="#a8cde8" opacity="0.5" />
    </svg>
  );
}
