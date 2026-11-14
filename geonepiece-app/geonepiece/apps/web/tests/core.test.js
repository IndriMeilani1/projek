import { describe, expect, it } from 'vitest';
import { cutParallelogram, halfTurnCopy, kite, kiteOuterTriangles, parallelogram, polygonArea, translate } from '../src/geometry/geometry.js';
import { evaluateText } from '../src/utils/evaluate.js';
import { parseNumberId } from '../src/utils/format.js';
import { nGain, nGainCategory, summarize } from '../src/features/assessment/scoring.js';
import { testToken } from '../src/features/assessment/token.js';

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
  it('ringkasan & N-gain', () => {
    const s = summarize({ '1.1': 4, '1.2': 2, '2.1': 3, '2.2': 4, '3.1': 4, '3.2': 1, '4.1': 3, '4.2': 4, '5.1': 4, '5.2': 2 });
    expect(s.total).toBe(31);
    expect(s.complete).toBe(true);
    expect(s.per).toEqual({ R: 9, F: 7, E: 12, I: 3 });
    expect(nGain(10, 31)).toBeCloseTo(0.7);
    expect(nGainCategory(0.7)).toBe('Tinggi');
    expect(nGainCategory(0.45)).toBe('Sedang');
  });
  it('token tes deterministik & berbeda per jenis/kelas', () => {
    const d = new Date('2026-11-20T08:00:00');
    expect(testToken('7A', 'pre', d)).toBe(testToken('7a', 'pre', d));
    expect(testToken('7A', 'pre', d)).not.toBe(testToken('7A', 'post', d));
    expect(testToken('7A', 'pre', d)).not.toBe(testToken('7B', 'pre', d));
    expect(testToken('7A', 'pre', d)).toHaveLength(6);
  });
});
