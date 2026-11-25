import { ITEM_ORDER, ITEM_PROCESS, MAX_NILAI, MAX_PER_ITEM, MAX_SCORE } from '@/content/tests';

/** Raw score (0–24) → nilai (0–100), one decimal. */
export const toNilai = (total) => Math.round((total / MAX_SCORE) * MAX_NILAI * 10) / 10;

/**
 * Sum the points a grader gave per solution stage, clamped to each stage's maximum.
 * @param {{points:number}[]} stages  stage definitions from KEYS[no].stages
 * @param {number[]} given            points given per stage (same order)
 */
export function stageTotal(stages, given = []) {
  return stages.reduce((sum, st, i) => sum + Math.min(st.points, Math.max(0, Number(given[i]) || 0)), 0);
}

/** Ringkasan skor satu attempt. scores = { '1': 6, '2': 4, ... } (skor mentah per soal, maks 6). */
export function summarize(scores = {}) {
  const per = { R: 0, F: 0, E: 0, I: 0 };
  const perMax = { R: 0, F: 0, E: 0, I: 0 };
  let total = 0;
  let scored = 0;
  for (const no of ITEM_ORDER) {
    const p = ITEM_PROCESS[no];
    perMax[p] += MAX_PER_ITEM;
    const s = scores[no];
    if (typeof s === 'number') {
      total += s;
      per[p] += s;
      scored++;
    }
  }
  return {
    total,
    nilai: toNilai(total),
    scored,
    complete: scored === ITEM_ORDER.length,
    per,
    perPct: Object.fromEntries(Object.keys(per).map((k) => [k, Math.round((per[k] / perMax[k]) * 100)])),
  };
}

/** N-gain (Hake): (post − pre) / (maks − pre). */
export function nGain(pre, post, max = MAX_SCORE) {
  if (pre == null || post == null || pre >= max) return null;
  return (post - pre) / (max - pre);
}

export function nGainCategory(g) {
  if (g == null) return '–';
  if (g >= 0.7) return 'Tinggi';
  if (g >= 0.3) return 'Sedang';
  return 'Rendah';
}

const num = (v) => (v == null || Number.isNaN(v) ? '' : String(Math.round(v * 1000) / 1000).replace('.', ','));
const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

/** CSV skor per attempt (pemisah ";" dan koma desimal agar rapi di Excel Indonesia). */
export function scoresCsv(attempts, scoresById) {
  const head = ['kode_kelas', 'kode_siswa', 'tes', 'paket', 'dikirim', ...ITEM_ORDER.map((n) => `soal_${n}`), 'total', 'nilai', 'R', 'F', 'E', 'I'];
  const rows = attempts.map((a) => {
    const sc = scoresById[a.id] ?? {};
    const s = summarize(sc);
    return [a.classCode, a.studentCode, a.kind === 'pre' ? 'pretest' : 'posttest', a.package, a.submittedAt ?? '', ...ITEM_ORDER.map((n) => sc[n] ?? ''), s.total, num(s.nilai), s.per.R, s.per.F, s.per.E, s.per.I];
  });
  return '﻿' + [head, ...rows].map((r) => r.map(cell).join(';')).join('\n');
}

/** Pasangkan pretest & posttest per siswa → baris rekap N-gain. */
export function gainRows(attempts, scoresById) {
  const by = {};
  for (const a of attempts) {
    const k = `${a.classCode}.${a.studentCode}`;
    by[k] ??= { classCode: a.classCode, studentCode: a.studentCode };
    const s = summarize(scoresById[a.id]);
    by[k][a.kind] = s;
  }
  return Object.values(by)
    .map((r) => {
      const g = r.pre?.complete && r.post?.complete ? nGain(r.pre.total, r.post.total) : null;
      return { ...r, gain: g, category: nGainCategory(g) };
    })
    .sort((x, y) => x.studentCode.localeCompare(y.studentCode, 'id', { numeric: true }));
}

export function gainCsv(rows) {
  const head = ['kode_kelas', 'kode_siswa', 'skor_pretest', 'skor_posttest', 'nilai_pretest', 'nilai_posttest', 'n_gain', 'kategori'];
  const body = rows.map((r) => [r.classCode, r.studentCode, r.pre?.total ?? '', r.post?.total ?? '', num(r.pre?.nilai), num(r.post?.nilai), num(r.gain), r.category]);
  return '﻿' + [head, ...body].map((r) => r.map(cell).join(';')).join('\n');
}
