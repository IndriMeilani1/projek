import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { allItems, packageForKind, TEST_RULES } from '@/content/tests';
import { attemptFileName, remainingSeconds, saveAnswer, startAttempt, submitAttempt, useAttempt } from './attempts';
import { checkToken } from './token';
import { flushOutbox, hasApi } from './sync';
import { Calculator } from './Calculator';
import { SketchPad } from './SketchPad';
import { ProblemReader } from '@/features/practice/ProblemReader';
import { Feedback, Icon } from '@/components/ui';
import { Link } from '@/app/router';
import { downloadFile } from '@/utils/storage';
import { stepVariants } from '@/motion/springs';

export function TestRunner({ kind, session }) {
  const attempt = useAttempt(session, kind);
  const pkg = packageForKind(kind);

  if (!attempt) return <TestGate kind={kind} session={session} pkg={pkg} />;
  if (attempt.status === 'submitted') return <TestDone attempt={attempt} />;
  return <TestSheet attempt={attempt} pkg={pkg} />;
}

// ---------- 1. Gerbang token + petunjuk ----------
function TestGate({ kind, session, pkg }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [agree, setAgree] = useState(false);
  const start = (e) => {
    e.preventDefault();
    if (!checkToken(token, session.classCode, kind)) {
      setError('Token salah atau sudah kedaluwarsa. Tanyakan token hari ini kepada guru.');
      return;
    }
    startAttempt(session, kind);
  };
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="card p-5">
        <p className="chip mb-2 bg-laut-100 text-laut-900">{kind === 'pre' ? 'Sebelum belajar' : 'Sesudah belajar'}</p>
        <h1 className="text-2xl font-extrabold text-laut-900">{pkg.title}</h1>
        <p className="mt-1 text-slate-600">
          Tes literasi matematika · {allItems(pkg).length} soal · {TEST_RULES.durationMin} menit
        </p>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-slate-700">
          {TEST_RULES.instructions.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </div>
      <form onSubmit={start} className="card space-y-3 p-5">
        <label className="label" htmlFor="token">
          Token tes dari guru
        </label>
        <input
          id="token"
          className="input text-center font-mono text-2xl tracking-[0.4em] uppercase"
          value={token}
          maxLength={6}
          onChange={(e) => {
            setToken(e.target.value);
            setError('');
          }}
          autoComplete="off"
          placeholder="••••••"
        />
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1 size-5" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>Saya akan mengerjakan sendiri dengan jujur. Kode saya: <b>{session.classCode} / {session.studentCode}</b></span>
        </label>
        {error && <Feedback tone="warn">{error}</Feedback>}
        <button className="btn-primary w-full" disabled={token.length < 6 || !agree}>
          <Icon name="play" /> Mulai mengerjakan
        </button>
      </form>
    </div>
  );
}

// ---------- 2. Lembar soal ----------
function useCountdown(attempt) {
  const [left, setLeft] = useState(() => remainingSeconds(attempt));
  useEffect(() => {
    const t = setInterval(() => setLeft(remainingSeconds(attempt)), 1000);
    return () => clearInterval(t);
  }, [attempt]);
  return left;
}

function TestSheet({ attempt, pkg }) {
  const items = useMemo(() => allItems(pkg), [pkg]);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [review, setReview] = useState(false);
  const [calc, setCalc] = useState(false);
  const left = useCountdown(attempt);

  useEffect(() => {
    if (left === 0) submitAttempt(attempt, 'waktu-habis');
  }, [left, attempt]);

  const go = (i) => {
    setDir(i > idx ? 1 : -1);
    setIdx(i);
    setReview(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const answered = (no) => {
    const a = attempt.answers[no];
    return Boolean(a && (a.text?.trim() || a.choice || a.sketch));
  };
  const item = items[idx];
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  return (
    <div className="mx-auto max-w-3xl">
      {/* Bilah atas: waktu + navigasi soal */}
      <div className="sticky top-0 z-30 -mx-4 mb-4 bg-pasir-50/95 px-4 pb-2 pt-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className={`chip tabular-nums ${left < 300 ? 'animate-pulse bg-rose-100 text-rose-800' : 'bg-white text-slate-700 ring-1 ring-slate-200'}`}>
            <Icon name="clock" size={18} /> {mm}:{ss}
          </span>
          <span className="truncate text-sm font-bold text-slate-500">{pkg.title}</span>
          <button className="btn-soft ml-auto px-3" onClick={() => setCalc((c) => !c)} aria-pressed={calc}>
            <Icon name="calc" /> <span className="hidden sm:inline">Kalkulator</span>
          </button>
        </div>
        <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto pb-1">
          {items.map((it, i) => (
            <button
              key={it.no}
              onClick={() => go(i)}
              className={`size-10 shrink-0 rounded-xl text-sm font-extrabold ring-2 transition ${
                i === idx && !review ? 'bg-laut-700 text-white ring-laut-700' : answered(it.no) ? 'bg-laut-100 text-laut-900 ring-laut-200' : 'bg-white text-slate-500 ring-slate-200'
              }`}
              aria-label={`Soal ${it.no}${answered(it.no) ? ', sudah dijawab' : ''}`}
            >
              {it.no}
            </button>
          ))}
          <button onClick={() => setReview(true)} className={`shrink-0 rounded-xl px-3 text-sm font-extrabold ring-2 ${review ? 'bg-laut-700 text-white ring-laut-700' : 'bg-white ring-slate-200'}`}>
            Tinjau
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        {review ? (
          <motion.div key="review" variants={stepVariants} custom={dir} initial="initial" animate="animate" exit="exit">
            <Review items={items} answered={answered} go={go} attempt={attempt} />
          </motion.div>
        ) : (
          <motion.div key={item.no} variants={stepVariants} custom={dir} initial="initial" animate="animate" exit="exit">
            <ItemView item={item} attempt={attempt} />
            <div className="mt-4 flex justify-between gap-2">
              <button className="btn-ghost" onClick={() => go(idx - 1)} disabled={idx === 0}>
                <Icon name="arrowLeft" /> Sebelumnya
              </button>
              {idx < items.length - 1 ? (
                <button className="btn-primary" onClick={() => go(idx + 1)}>
                  Berikutnya <Icon name="arrowRight" />
                </button>
              ) : (
                <button className="btn-primary" onClick={() => setReview(true)}>
                  Tinjau jawaban <Icon name="check" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>{calc && <Calculator onClose={() => setCalc(false)} />}</AnimatePresence>
    </div>
  );
}

function ItemView({ item, attempt }) {
  const ans = attempt.answers[item.no] ?? {};
  const [sketchOpen, setSketchOpen] = useState(Boolean(ans.sketch));
  const save = (patch) => saveAnswer(attempt, item.no, patch);
  const unitMarks = attempt.answers[`reader-${item.unit.id}`]?.marks ?? {};

  return (
    <div className="space-y-4">
      <section className="card p-4 sm:p-5">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-laut-700">
          Soal {item.no} · {item.unit.title}
        </p>
        <ProblemReader sentences={item.unit.sentences} marks={unitMarks} onChange={(m) => saveAnswer(attempt, `reader-${item.unit.id}`, { marks: m })} showTable={false} />
        {item.unit.figure && <img src={item.unit.figure} alt={item.unit.figureAlt} className="mx-auto mt-3 max-h-80 w-auto max-w-full rounded-xl" loading="lazy" />}
      </section>

      <section className="card space-y-3 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-laut-700 text-lg font-extrabold text-white">{item.no}</span>
          <p className="text-lg font-semibold leading-relaxed">{item.prompt}</p>
        </div>

        {item.type === 'choice' && (
          <div className="grid gap-2" role="radiogroup" aria-label={`Pilihan soal ${item.no}`}>
            {item.choices.map((c) => (
              <button
                key={c.id}
                role="radio"
                aria-checked={ans.choice === c.id}
                onClick={() => save({ choice: c.id })}
                className={`flex items-start gap-3 rounded-2xl p-3 text-left ring-2 transition ${ans.choice === c.id ? 'bg-laut-50 ring-laut-500' : 'bg-white ring-slate-200 hover:ring-laut-200'}`}
              >
                <span className={`grid size-8 shrink-0 place-items-center rounded-full font-extrabold ${ans.choice === c.id ? 'bg-laut-700 text-white' : 'bg-slate-100'}`}>{c.id}</span>
                <span className="pt-1">{c.text}</span>
              </button>
            ))}
          </div>
        )}

        <label className="label" htmlFor={`ans-${item.no}`}>
          {item.type === 'choice' ? 'Alasanmu' : 'Jawaban, cara, dan alasanmu'}
        </label>
        <textarea
          id={`ans-${item.no}`}
          className="input min-h-40 text-base leading-relaxed"
          value={ans.text ?? ''}
          onChange={(e) => save({ text: e.target.value })}
          placeholder="Tuliskan langkah-langkahmu di sini…"
        />
        <div className="flex items-center justify-between">
          <button className="btn-soft" onClick={() => setSketchOpen((o) => !o)}>
            <Icon name="pencil" /> {sketchOpen ? 'Tutup gambar' : 'Gambar / sketsa'}
          </button>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
            <Icon name="check" size={16} /> Tersimpan otomatis
          </span>
        </div>
        {sketchOpen && <SketchPad value={ans.sketch} onChange={(sketch) => save({ sketch })} />}
      </section>
    </div>
  );
}

function Review({ items, answered, go, attempt }) {
  const [confirm, setConfirm] = useState(false);
  const empty = items.filter((it) => !answered(it.no));
  return (
    <div className="card space-y-4 p-5">
      <h2 className="text-xl font-extrabold text-laut-900">Tinjau jawaban</h2>
      <div className="grid grid-cols-4 gap-2">
        {items.map((it, i) => (
          <button key={it.no} onClick={() => go(i)} className={`rounded-2xl p-2 text-center ring-2 ${answered(it.no) ? 'bg-laut-50 ring-laut-200' : 'bg-rose-50 ring-rose-200'}`}>
            <div className="font-extrabold">{it.no}</div>
            <div className="text-[11px] font-bold text-slate-500">{answered(it.no) ? 'terisi' : 'kosong'}</div>
          </button>
        ))}
      </div>
      {empty.length > 0 && <Feedback tone="warn">Masih ada {empty.length} soal yang belum dijawab: {empty.map((e) => e.no).join(', ')}.</Feedback>}
      {!confirm ? (
        <button className="btn-primary w-full" onClick={() => setConfirm(true)}>
          Kumpulkan jawaban
        </button>
      ) : (
        <div className="space-y-2 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
          <p className="font-bold text-amber-900">Yakin mengumpulkan? Setelah dikumpulkan, jawaban tidak bisa diubah.</p>
          <div className="flex gap-2">
            <button className="btn-primary flex-1" onClick={() => { submitAttempt(attempt); flushOutbox(); }}>
              Ya, kumpulkan
            </button>
            <button className="btn-ghost flex-1" onClick={() => setConfirm(false)}>
              Periksa lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- 3. Selesai ----------
function TestDone({ attempt }) {
  useEffect(() => {
    flushOutbox();
  }, []);
  return (
    <div className="mx-auto max-w-xl space-y-4 text-center">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="mx-auto grid size-24 place-items-center rounded-full bg-emerald-100 text-emerald-700">
        <Icon name="check" size={56} strokeWidth={3} />
      </motion.div>
      <h1 className="text-2xl font-extrabold text-laut-900">Jawaban sudah dikumpulkan!</h1>
      <p className="text-slate-600">
        {attempt.submitReason === 'waktu-habis' ? 'Waktu habis, jawabanmu dikumpulkan otomatis. ' : ''}
        Terima kasih sudah mengerjakan dengan jujur.
      </p>
      <div className="card space-y-3 p-4 text-left">
        {hasApi() ? (
          <p className="flex items-center gap-2 font-bold">
            <Icon name={attempt.synced ? 'check' : 'wifiOff'} />
            {attempt.synced ? 'Jawaban sudah terkirim ke server guru.' : 'Tersimpan di HP, akan terkirim otomatis saat ada internet.'}
          </p>
        ) : (
          <p className="text-sm text-slate-600">Jika gurumu meminta, unduh file jawaban dan kirimkan kepada guru.</p>
        )}
        <button className="btn-soft w-full" onClick={() => downloadFile(attemptFileName(attempt), JSON.stringify(attempt))}>
          <Icon name="download" /> Unduh file jawaban
        </button>
      </div>
      <Link to="/" className="btn-primary">
        Kembali ke beranda
      </Link>
    </div>
  );
}
