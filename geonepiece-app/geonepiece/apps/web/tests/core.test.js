import { describe, expect, it } from 'vitest';
import { cutParallelogram, halfTurnCopy, kite, kiteOuterTriangles, parallelogram, polygonArea, translate } from '../src/geometry/geometry.js';
import { evaluateText } from '../src/utils/evaluate.js';
import { parseNumberId } from '../src/utils/format.js';
import { nGain, nGainCategory, stageTotal, summarize, toNilai } from '../src/features/assessment/scoring.js';
import { ITEM_ORDER, MAX_PER_ITEM, MAX_SCORE } from '../src/content/tests.js';
import { KEYS } from '../src/content/keys.js';
import { testToken } from '../src/features/assessment/token.js';
import { maskAnswer } from '../src/utils/answerGuard.js';
import { buildContext, buildMessages, TUTOR_RULES } from '../src/features/rmt/tutorPrompt.js';
import { RMT_PHASES } from '../src/content/rmt.js';

const close = (a, b) => Math.abs(a - b) < 1e-9;

describe('geometri: luas tetap setelah transformasi', () => {
  it('jajar genjang dipotong & digeser = persegi panjang a × t', () => {
    for (const [b, h, s, c] of [[6, 4, 2, 2], [8, 5, 3, 6], [5, 3, 5, 5]]) {
      const { left, right, target } = cutParallelogram(b, h, s, c);
      const moved = translate(left, target.x, target.y);
      expect(close(polygonArea(parallelogram(b, h, s)), b * h)).toBe(true);
      expect(close(polygonArea(left) + polygonArea(right), b * h)).toBe(true);
      expect(close(polygonArea(moved), polygonArea(left))).toBe(true);
    }
  });

  it('segitiga + salinan putar 180° = jajar genjang (2 × luas)', () => {
    const tri = [{ x: 0, y: 0 }, { x: 6, y: 0 }, { x: -2, y: 4 }];
    const copy = halfTurnCopy(tri, tri[1], tri[2], 1);
    expect(close(polygonArea(tri), 12)).toBe(true);
    expect(close(polygonArea([tri[0], tri[1], copy[0], tri[2]]), 24)).toBe(true);
  });

  it('layang-layang = ½ × d1 × d2 dan potongan luar menutup tepat', () => {
    const k = kite(6, 8, 5.5);
    expect(close(polygonArea(k.points), 24)).toBe(true);
    const outer = kiteOuterTriangles(6, 8, 5.5).reduce((s, t) => s + polygonArea(halfTurnCopy(t.pts, t.edge[0], t.edge[1], 1)), 0);
    expect(close(outer, 24)).toBe(true);
  });
});

describe('evaluator & angka Indonesia', () => {
  it('menghitung ekspresi', () => {
    expect(evaluateText('12 × 8')).toBe(96);
    expect(evaluateText('(10 + 16) ÷ 2 × 8 − 9')).toBe(95);
    expect(evaluateText('7,5 × 2')).toBe(15);
    expect(Number.isNaN(evaluateText('3 ×'))).toBe(true);
  });
  it('membaca angka gaya Indonesia', () => {
    expect(parseNumberId('Rp2.375.000')).toBe(2375000);
    expect(parseNumberId('216.000')).toBe(216000);
    expect(parseNumberId('7,5')).toBe(7.5);
    expect(parseNumberId('288 m²')).toBe(288);
    expect(parseNumberId('0.3')).toBe(0.3);
  });
});

describe('penskoran', () => {
  it('ringkasan & N-gain (skor maks 24 → nilai maks 100)', () => {
    const full = summarize({ 1: 6, 2: 6, 3: 6, 4: 6 });
    expect(full.total).toBe(24);
    expect(full.nilai).toBe(100);
    expect(full.complete).toBe(true);

    const s = summarize({ 1: 5, 2: 4, 3: 6, 4: 3 });
    expect(s.total).toBe(18);
    expect(s.nilai).toBe(75);
    expect(s.per).toEqual({ R: 5, F: 4, E: 6, I: 3 });
    expect(s.perPct).toEqual({ R: 83, F: 67, E: 100, I: 50 });

    expect(summarize({ 1: 6, 2: 6 }).complete).toBe(false);
    expect(nGain(6, 18)).toBeCloseTo(2 / 3);
    expect(nGainCategory(0.7)).toBe('Tinggi');
    expect(nGainCategory(0.45)).toBe('Sedang');
  });
  it('kunci: setiap soal berjumlah 6 poin dan jawabannya cocok dengan perhitungan', () => {
    for (const no of ITEM_ORDER) {
      expect(KEYS[no].stages.reduce((a, st) => a + st.points, 0)).toBe(MAX_PER_ITEM);
      expect(stageTotal(KEYS[no].stages, KEYS[no].stages.map((st) => st.points))).toBe(MAX_PER_ITEM);
    }
    // Paket A / B: hasil luas di kunci
    expect([8 * 6, 9 * 9, (12 * 8) / 2, 10 * 7]).toEqual([48, 81, 48, 70]);
    expect([9 * 5, 11 * 11, (14 * 10) / 2, 12 * 6]).toEqual([45, 121, 70, 72]);
    expect(stageTotal(KEYS[3].stages, [1, 2, 5, 0])).toBe(5); // dibatasi poin maks tiap tahap
    expect(toNilai(MAX_SCORE)).toBe(100);
  });
  it('token tes deterministik & berbeda per jenis/kelas', () => {
    const d = new Date('2026-11-20T08:00:00');
    expect(testToken('7A', 'pre', d)).toBe(testToken('7a', 'pre', d));
    expect(testToken('7A', 'pre', d)).not.toBe(testToken('7A', 'post', d));
    expect(testToken('7A', 'pre', d)).not.toBe(testToken('7B', 'pre', d));
    expect(testToken('7A', 'pre', d)).toHaveLength(6);
  });
});

describe('Tutor RMT: tidak membocorkan jawaban akhir', () => {
  it('menyamarkan angka jawaban dalam berbagai format', () => {
    expect(maskAnswer('Jadi luasnya 144 m².', 144)).toBe('Jadi luasnya … m².');
    expect(maskAnswer('Hasilnya 12.000 cm² atau 12000 cm²', 12000)).toBe('Hasilnya … cm² atau … cm²');
    expect(maskAnswer('Luasnya 0,3 m²', 0.3)).toBe('Luasnya … m²');
    expect(maskAnswer('L = 2 × 1,5 = 3', 3)).toBe('L = 2 × 1,5 = …');
  });
  it('tidak mengubah angka lain yang hanya mirip', () => {
    expect(maskAnswer('Sisi 12 m, keliling 1440 cm, 14,4 m', 144)).toBe('Sisi 12 m, keliling 1440 cm, 14,4 m');
    expect(maskAnswer('alas 1,5 m', 5)).toBe('alas 1,5 m');
  });
  it('prompt sistem melarang jawaban akhir & memuat fase RMT', () => {
    expect(TUTOR_RULES).toMatch(/JANGAN PERNAH memberikan jawaban akhir/);
    for (const p of RMT_PHASES) expect(TUTOR_RULES).toContain(p.label);
    const item = { sentences: [{ text: 'Taman persegi sisi 12 m.', tag: 'diketahui' }, { text: 'Berapa luasnya?', tag: 'ditanya' }], unit: 'm²', answer: 144 };
    const ctx = buildContext({ item, phaseId: 'eksplorasi', marks: { 1: 'ditanya' } });
    expect(ctx).toContain('FASE SAAT INI: Eksplorasi');
    expect(ctx).toContain('Ditanya: "Berapa luasnya?"');
    expect(buildMessages(ctx, Array.from({ length: 20 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', content: `m${i}` })))).toHaveLength(10);
  });
});
