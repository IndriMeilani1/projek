// Pustaka geometri MURNI (tanpa React). Satuan dunia: 1 = 1 petak satuan, sumbu y ke atas.

/** @typedef {{x:number, y:number}} Pt */

export const P = (x, y) => ({ x, y });

/** Luas poligon (rumus shoelace), selalu positif. */
export function polygonArea(points) {
  let s = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    s += a.x * b.y - b.x * a.y;
  }
  return Math.abs(s) / 2;
}

export const translate = (points, dx, dy) => points.map((p) => ({ x: p.x + dx, y: p.y + dy }));

/** Putar titik-titik sebesar `angle` radian terhadap `origin`. */
export function rotate(points, angle, origin) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return points.map((p) => {
    const dx = p.x - origin.x;
    const dy = p.y - origin.y;
    return { x: origin.x + dx * c - dy * s, y: origin.y + dx * s + dy * c };
  });
}

export const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const lerp = (a, b, t) => a + (b - a) * t;
export const lerpPoint = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });

/** Kaki garis tegak lurus dari titik p ke garis AB. */
export function perpendicularFoot(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
  return { x: a.x + t * dx, y: a.y + t * dy };
}

/** Apakah posisi cukup dekat dengan target untuk "menempel" (snap)? */
export const shouldSnap = (pos, target, tol) => distance(pos, target) <= tol;

// ---- Bangun dasar (dipakai simulasi & tes unit) ----

/** Jajar genjang dengan alas b, tinggi h, pergeseran sisi atas s. */
export function parallelogram(b, h, s) {
  return [P(0, 0), P(b, 0), P(b + s, h), P(s, h)];
}

/**
 * Potong jajar genjang dengan garis tegak x = c (s ≤ c ≤ b).
 * Mengembalikan potongan kiri & kanan. Potongan kiri digeser sejauh b → persegi panjang.
 */
export function cutParallelogram(b, h, s, c) {
  const left = [P(0, 0), P(c, 0), P(c, h), P(s, h)];
  const right = [P(c, 0), P(b, 0), P(b + s, h), P(c, h)];
  return { left, right, target: { x: b, y: 0 } };
}

/** Salinan bangun yang diputar 180° terhadap titik tengah sebuah sisi (t: 0..1). */
export function halfTurnCopy(points, edgeA, edgeB, t = 1) {
  return rotate(points, Math.PI * t, midpoint(edgeA, edgeB));
}

/** Layang-layang dengan diagonal mendatar d1, tegak d2, titik potong diagonal di ketinggian m. */
export function kite(d1, d2, m) {
  const T = P(d1 / 2, d2);
  const R = P(d1, m);
  const B = P(d1 / 2, 0);
  const L = P(0, m);
  return { T, R, B, L, points: [T, R, B, L] };
}

/** Empat segitiga di luar layang-layang tetapi di dalam persegi panjang d1 × d2. */
export function kiteOuterTriangles(d1, d2, m) {
  const { T, R, B, L } = kite(d1, d2, m);
  return [
    { pts: [L, P(0, d2), T], edge: [L, T] },
    { pts: [T, P(d1, d2), R], edge: [T, R] },
    { pts: [R, P(d1, 0), B], edge: [R, B] },
    { pts: [B, P(0, 0), L], edge: [B, L] },
  ];
}
