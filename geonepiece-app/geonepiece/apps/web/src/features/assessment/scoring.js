import { ITEM_ORDER, ITEM_PROCESS, MAX_PER_ITEM, MAX_SCORE } from '@/content/tests';

/** Ringkasan skor satu attempt. scores = { '1.1': 3, ... } */
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
    nilai: Math.round((total / MAX_SCORE) * 1000) / 10,
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
  const head = ['kode_kelas', 'kode_siswa', 'tes', 'paket', 'dikirim', ...ITEM_ORDER, 'total', 'nilai', 'R', 'F', 'E', 'I'];
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
  const head = ['kode_kelas', 'kode_siswa', 'pretest', 'posttest', 'n_gain', 'kategori'];
  const body = rows.map((r) => [r.classCode, r.studentCode, r.pre?.total ?? '', r.post?.total ?? '', num(r.gain), r.category]);
  return '﻿' + [head, ...body].map((r) => r.map(cell).join(';')).join('\n');
}
