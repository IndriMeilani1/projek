import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '@/components/ui';
import { getPhase, TUTOR_TEXT } from '@/content/rmt';
import { AiError, chat, isAiEnabled } from '@/services/groq';
import { maskAnswer } from '@/utils/answerGuard';
import { buildContext, buildMessages } from './tutorPrompt';

// Guards for a shared free-tier key (≈30 requests/minute for the whole class).
const MAX_TURNS_PER_ITEM = 12;
const COOLDOWN_MS = 6000;

const QUICK = {
  analisis: ['Aku bingung mulai dari mana', 'Informasi mana yang penting?'],
  eksplorasi: ['Rumus apa yang cocok?', 'Apakah rencanaku sudah tepat?'],
  jawab: ['Tolong cek langkahku', 'Satuannya apa ya?'],
  refleksi: ['Apa aturan umumnya?', 'Di mana lagi cara ini dipakai?'],
};

/**
 * RMT tutor panel. Uses Groq when available; otherwise falls back to the built-in
 * mediating questions for the current phase (works offline).
 * `work` = { marks, plan, answer, reflection, solved } — the student's visible work.
 */
export function RmtTutor({ item, phaseId, work }) {
  const phase = getPhase(phaseId);
  const aiOn = isAiEnabled();
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(aiOn ? null : TUTOR_TEXT.offline);
  const lastSent = useRef(0);
  const listRef = useRef(null);
  const turns = history.filter((m) => m.role === 'user').length;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [history, loading]);

  const send = async (text) => {
    const msg = text.trim().slice(0, 500);
    if (!msg || loading) return;
    if (turns >= MAX_TURNS_PER_ITEM) return setNotice(TUTOR_TEXT.limit);
    if (Date.now() - lastSent.current < COOLDOWN_MS) return setNotice(TUTOR_TEXT.cooldown);
    lastSent.current = Date.now();
    const next = [...history, { role: 'user', content: msg }];
    setHistory(next);
    setInput('');
    setNotice(null);
    setLoading(true);
    try {
      const context = buildContext({ item, phaseId, ...work });
      const raw = await chat(buildMessages(context, next));
      const reply = work.solved ? raw : maskAnswer(raw, item.answer);
      setHistory((h) => [...h, { role: 'assistant', content: reply || 'Hmm, coba jelaskan lagi pikiranmu, ya.' }]);
    } catch (e) {
      const kind = e instanceof AiError ? e.kind : 'error';
      setNotice(kind === 'busy' ? TUTOR_TEXT.busy : kind === 'offline' || kind === 'disabled' ? TUTOR_TEXT.offline : TUTOR_TEXT.error);
      setHistory((h) => h.slice(0, -1));
      setInput(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-3 rounded-3xl bg-laut-900 p-3 text-white ring-2 ring-emas-400 sm:p-4" aria-label="Tutor RMT">
      <header className="flex flex-wrap items-center gap-2">
        <span className="grid size-9 place-items-center rounded-full bg-emas-400 text-laut-950">
          <Icon name="sparkles" size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl leading-none text-emas-300">{TUTOR_TEXT.title}</p>
          <p className="text-xs text-laut-100">
            Fase {phase.no} · {phase.label} ({phase.phase})
          </p>
        </div>
        {aiOn && <span className="chip bg-white/10 text-[0.7rem] text-laut-100">{MAX_TURNS_PER_ITEM - turns} pesan tersisa</span>}
      </header>

      {aiOn && (
        <>
          <div ref={listRef} className="max-h-72 space-y-2 overflow-y-auto pr-1" aria-live="polite">
            <Bubble role="assistant">{TUTOR_TEXT.intro}</Bubble>
            <AnimatePresence initial={false}>
              {history.map((m, i) => (
                <Bubble key={i} role={m.role}>
                  {m.content}
                </Bubble>
              ))}
            </AnimatePresence>
            {loading && <Bubble role="assistant">Sedang berpikir…</Bubble>}
          </div>

          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {(QUICK[phase.id] ?? []).map((q) => (
              <button key={q} onClick={() => send(q)} disabled={loading} className="min-h-11 shrink-0 rounded-full bg-white/10 px-3 text-sm font-bold text-laut-50 ring-1 ring-white/20 hover:bg-white/20 disabled:opacity-40">
                {q}
              </button>
            ))}
          </div>

          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label className="sr-only" htmlFor={`tutor-${item.id}`}>
              Pesan untuk Tutor RMT
            </label>
            <textarea
              id={`tutor-${item.id}`}
              rows={2}
              maxLength={500}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder={TUTOR_TEXT.placeholder}
              className="min-h-11 flex-1 resize-none rounded-2xl bg-white px-3 py-2 text-base text-slate-800 outline-none ring-2 ring-transparent focus:ring-emas-400"
            />
            <button className="btn-primary size-11 shrink-0 p-0" disabled={!input.trim() || loading} aria-label="Kirim">
              <Icon name="arrowRight" />
            </button>
          </form>
          <p className="text-[0.7rem] leading-snug text-laut-100/80">{TUTOR_TEXT.privacy}</p>
        </>
      )}

      {notice && <p className="rounded-2xl bg-emas-100 px-3 py-2 text-sm font-bold text-kertas-900">{notice}</p>}

      <details className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10" open={!aiOn}>
        <summary className="cursor-pointer text-sm font-extrabold text-emas-300">Pertanyaan penuntun fase {phase.label}</summary>
        <ul className="mt-2 space-y-1.5 text-sm text-laut-50">
          {phase.questions.map((q) => (
            <li key={q} className="flex gap-2">
              <span aria-hidden="true" className="text-emas-300">
                ✦
              </span>
              {q}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

function Bubble({ role, children }) {
  const mine = role === 'user';
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${mine ? 'ml-auto bg-emas-300 text-laut-950' : 'bg-white/10 text-white'}`}
    >
      {children}
    </motion.p>
  );
}
