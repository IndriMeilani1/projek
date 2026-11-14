import { createStore, useStore } from '@/stores/createStore';
import { packageForKind, TEST_RULES } from '@/content/tests';

/*
 * Lembar jawaban tes disimpan di HP (localStorage) dan disinkronkan ke API bila tersedia.
 * Bentuk satu attempt:
 * { id, kind:'pre'|'post', package:'A'|'B', classCode, studentCode, startedAt, durationMin,
 *   answers: { '1.1': { text, choice, sketch, marks:{} } }, status:'active'|'submitted',
 *   submittedAt, synced }
 */
export const attemptsStore = createStore('attempts', {});

const keyOf = (classCode, studentCode, kind) => `${classCode}.${studentCode}.${kind}`;

export function useAttempt(session, kind) {
  const all = useStore(attemptsStore);
  return session ? all[keyOf(session.classCode, session.studentCode, kind)] ?? null : null;
}

export function useAllAttempts() {
  return useStore(attemptsStore);
}

export function startAttempt(session, kind) {
  const pkg = packageForKind(kind);
  const k = keyOf(session.classCode, session.studentCode, kind);
  const existing = attemptsStore.get()[k];
  if (existing) return existing;
  const attempt = {
    id: `${k}.${Date.now().toString(36)}`,
    kind,
    package: pkg.id,
    classCode: session.classCode,
    studentCode: session.studentCode,
    startedAt: new Date().toISOString(),
    durationMin: TEST_RULES.durationMin,
    answers: {},
    status: 'active',
    synced: false,
  };
  attemptsStore.set((all) => ({ ...all, [k]: attempt }));
  return attempt;
}

export function saveAnswer(attempt, itemNo, patch) {
  const k = keyOf(attempt.classCode, attempt.studentCode, attempt.kind);
  attemptsStore.set((all) => {
    const cur = all[k];
    if (!cur || cur.status !== 'active') return all;
    const prev = cur.answers[itemNo] ?? {};
    return {
      ...all,
      [k]: { ...cur, answers: { ...cur.answers, [itemNo]: { ...prev, ...patch, updatedAt: Date.now() } }, synced: false },
    };
  });
}

export function submitAttempt(attempt, reason = 'manual') {
  const k = keyOf(attempt.classCode, attempt.studentCode, attempt.kind);
  attemptsStore.set((all) => ({
    ...all,
    [k]: { ...all[k], status: 'submitted', submittedAt: new Date().toISOString(), submitReason: reason, synced: false },
  }));
  return attemptsStore.get()[k];
}

export function markSynced(attemptId) {
  attemptsStore.set((all) => {
    const out = { ...all };
    for (const [k, a] of Object.entries(out)) if (a.id === attemptId) out[k] = { ...a, synced: true };
    return out;
  });
}

export function remainingSeconds(attempt, now = Date.now()) {
  const end = new Date(attempt.startedAt).getTime() + attempt.durationMin * 60_000;
  return Math.max(0, Math.round((end - now) / 1000));
}

/** Untuk dikirim ke guru sebagai file .json (mode mandiri). */
export function attemptFileName(a) {
  return `geonepiece_${a.classCode}_${a.studentCode}_${a.kind === 'pre' ? 'pretest' : 'posttest'}.json`;
}
