import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ProblemReader, checkMarks } from './ProblemReader';
import { Feedback, Icon } from '@/components/ui';
import { parseNumberId } from '@/utils/format';
import { RMT_PHASES } from '@/content/rmt';
import { RmtPhaseNav } from '@/features/rmt/RmtPhaseNav';
import { RmtTutor } from '@/features/rmt/RmtTutor';

/*
 * Satu soal latihan dengan alur Rigorous Mathematical Thinking (RMT):
 *   1 Analisis (Input)      — Pembaca Soal: diketahui / ditanya / tidak diperlukan
 *   2 Eksplorasi (Elaborasi) — rencana: bangun, rumus + alasan, langkah; pertanyaan penuntun bertingkat
 *   3 Jawab (Output)         — jawaban numerik + umpan balik berbasis miskonsepsi
 *   4 Refleksi (Metakognisi) — menilai strategi, aturan umum (transendensi), makna
 * Tutor RMT (AI Groq, atau pertanyaan bawaan saat offline) mendampingi di setiap fase.
 */
const MIN_PLAN = 15;
const MIN_REFLECTION = 15;

export function PracticeItem({ item, index, onSolved, onSimilar }) {
  const [phase, setPhase] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [marks, setMarks] = useState({});
  const [markFb, setMarkFb] = useState(null);
  const [plan, setPlan] = useState('');
  const [hints, setHints] = useState(0);
  const [ans, setAns] = useState('');
  const [fb, setFb] = useState(null);
  const [solved, setSolved] = useState(false);
  const [tries, setTries] = useState(0);
  const [reflection, setReflection] = useState('');
  const [reflected, setReflected] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);

  const goTo = (i) => {
    setUnlocked((u) => Math.max(u, i));
    setPhase(i);
  };

  const check = () => {
    const v = parseNumberId(ans);
    setTries((t) => t + 1);
    if (Number.isNaN(v)) return setFb({ tone: 'warn', text: 'Tuliskan jawabanmu berupa angka, misalnya 24 atau 7,5.' });
    if (Math.abs(v - item.answer) <= (item.tol ?? 0.01)) {
      setSolved(true);
      setFb({ tone: 'ok', text: `Benar! Jawabannya ${item.answer.toLocaleString('id-ID')} ${item.unit}. Sekarang lanjut refleksi, ya.` });
      onSolved?.(item.id, { tries: tries + 1, hints });
      setUnlocked((u) => Math.max(u, 3));
      return;
    }
    const mis = item.misconceptions?.find((m) => Math.abs(m.value - v) < 0.01);
    setFb({
      tone: 'warn',
      text: mis ? mis.msg : 'Belum tepat. Kembali ke fase Eksplorasi: apakah rumus dan rencanamu sudah sesuai dengan informasi yang kamu tandai?',
    });
  };

  const current = RMT_PHASES[phase];
  const known = Object.entries(marks).filter(([, t]) => t === 'diketahui').map(([i]) => item.sentences[i]);
  const asked = Object.entries(marks).filter(([, t]) => t === 'ditanya').map(([i]) => item.sentences[i]);
  const text = (s) => (typeof s === 'string' ? s : s.text);

  return (
    <article className={`card space-y-3 p-3 sm:p-4 ${solved ? 'ring-2 ring-emerald-300' : ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip bg-laut-100 text-laut-900">Soal {index + 1}</span>
        {solved && <span className="chip animate-pop bg-emerald-100 text-emerald-800">✓ Terjawab</span>}
        {reflected && <span className="chip animate-pop bg-emas-400 text-laut-950">✦ Refleksi selesai</span>}
        <button
          type="button"
          onClick={() => setTutorOpen((o) => !o)}
          aria-expanded={tutorOpen}
          className="btn ml-auto min-h-11 bg-laut-900 px-3 text-sm text-emas-300 ring-2 ring-emas-400 hover:bg-laut-800"
        >
          <Icon name="sparkles" size={18} /> {tutorOpen ? 'Tutup Tutor' : 'Tutor RMT'}
        </button>
      </div>

      <RmtPhaseNav current={phase} unlocked={unlocked} onChange={setPhase} />

      <p className="rounded-2xl bg-kertas-100 px-3 py-2 text-sm text-slate-700 ring-1 ring-kertas-300">
        <b className="text-laut-900">
          Fase {current.no} · {current.label} ({current.phase}):
        </b>{' '}
        {current.goal}
      </p>

      <div className={tutorOpen ? 'grid gap-3 lg:grid-cols-[1fr_minmax(0,22rem)]' : ''}>
        <div className="min-w-0 space-y-3">
          {phase === 0 && (
            <>
              <ProblemReader sentences={item.sentences} marks={marks} onChange={(m) => { setMarks(m); setMarkFb(null); }} />
              <div className="flex flex-wrap gap-2">
                <button className="btn-ghost px-2 text-sm" onClick={() => setMarkFb(checkMarks(item.sentences, marks))}>
                  <Icon name="eye" size={18} /> Cek sorotanku
                </button>
                <button className="btn-primary ml-auto" disabled={!asked.length} onClick={() => goTo(1)}>
                  Lanjut ke Eksplorasi <Icon name="arrowRight" />
                </button>
              </div>
              {!asked.length && <p className="text-xs text-slate-500">Tandai dulu kalimat yang <b>ditanyakan</b> sebelum lanjut.</p>}
              {markFb && <Feedback tone={markFb.ok ? 'ok' : 'info'}>{markFb.msg}</Feedback>}
            </>
          )}

          {phase === 1 && (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                <InfoList title="Diketahui" items={known.map(text)} cls="bg-sky-50 ring-sky-200" />
                <InfoList title="Ditanya" items={asked.map(text)} cls="bg-amber-50 ring-amber-200" />
              </div>
              <label className="label" htmlFor={`plan-${item.id}`}>
                Rencanaku: bangun apa, rumus apa (dan mengapa), lalu langkah-langkahnya
              </label>
              <textarea
                id={`plan-${item.id}`}
                className="input min-h-24 text-base"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="Contoh: Bangunnya … Rumus luasnya … karena … Langkah 1: … Langkah 2: …"
              />
              <div className="flex flex-wrap gap-2">
                {hints < item.hints.length && (
                  <button className="btn-warn" onClick={() => setHints((h) => h + 1)}>
                    <Icon name="bulb" /> Pertanyaan penuntun {hints + 1}
                  </button>
                )}
                <button className="btn-primary ml-auto" disabled={plan.trim().length < MIN_PLAN} onClick={() => goTo(2)}>
                  Lanjut ke Jawab <Icon name="arrowRight" />
                </button>
              </div>
              {plan.trim().length < MIN_PLAN && <p className="text-xs text-slate-500">Tuliskan rencanamu dulu. Orang yang berpikir teliti merencanakan sebelum menghitung.</p>}
              <AnimatePresence>
                {item.hints.slice(0, hints).map((h, i) => (
                  <motion.p key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-xl bg-emas-50 px-3 py-2 text-kertas-900 ring-1 ring-emas-300">
                    <b>Penuntun {i + 1}:</b> {h}
                  </motion.p>
                ))}
              </AnimatePresence>
            </>
          )}

          {phase === 2 && (
            <>
              {plan.trim() && (
                <p className="rounded-2xl bg-white/70 px-3 py-2 text-sm ring-1 ring-kertas-300">
                  <b>Rencanamu:</b> {plan}
                </p>
              )}
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
                {!solved ? (
                  <button className="btn-primary" onClick={check} disabled={!ans.trim()}>
                    Cek jawaban
                  </button>
                ) : (
                  <button className="btn-primary" onClick={() => goTo(3)}>
                    Lanjut ke Refleksi <Icon name="arrowRight" />
                  </button>
                )}
              </div>
              {fb && <Feedback tone={fb.tone}>{fb.text}</Feedback>}
            </>
          )}

          {phase === 3 && (
            <>
              <ul className="space-y-1.5 text-sm">
                {current.questions.map((q) => (
                  <li key={q} className="flex gap-2">
                    <span aria-hidden="true" className="text-emas-600">✦</span>
                    {q}
                  </li>
                ))}
              </ul>
              <label className="label" htmlFor={`refl-${item.id}`}>
                Refleksiku
              </label>
              <textarea
                id={`refl-${item.id}`}
                className="input min-h-24 text-base"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Langkah terpenting menurutku … Aturan umumnya … Aku bisa memakainya saat …"
                disabled={reflected}
              />
              <div className="flex flex-wrap gap-2">
                {!reflected && (
                  <button className="btn-primary" disabled={reflection.trim().length < MIN_REFLECTION} onClick={() => setReflected(true)}>
                    <Icon name="check" /> Simpan refleksi
                  </button>
                )}
                {reflected && onSimilar && (
                  <button className="btn-soft" onClick={onSimilar}>
                    <Icon name="sparkles" /> Coba soal mirip
                  </button>
                )}
              </div>
              {reflected && <Feedback tone="ok">Hebat! Kamu tidak hanya menemukan jawaban, tetapi juga memahami cara berpikirnya.</Feedback>}
            </>
          )}
        </div>

        {tutorOpen && (
          <div className="min-w-0">
            <RmtTutor item={item} phaseId={current.id} work={{ marks, plan, answer: ans, reflection, solved }} />
          </div>
        )}
      </div>
    </article>
  );
}

function InfoList({ title, items, cls }) {
  return (
    <div className={`rounded-2xl p-3 ring-1 ${cls}`}>
      <p className="mb-1 text-sm font-extrabold">{title}</p>
      <ul className="space-y-1 text-sm">
        {items.length ? items.map((t) => <li key={t}>• {t}</li>) : <li className="text-slate-400">— (tandai di fase Analisis)</li>}
      </ul>
    </div>
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
      <p className="text-center text-sm font-bold text-slate-500">{solved.size} soal terjawab</p>
    </div>
  );
}
