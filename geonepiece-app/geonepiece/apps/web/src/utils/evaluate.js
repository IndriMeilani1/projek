// Evaluator ekspresi aritmetika kecil (tanpa eval) untuk kalkulator & penyusun rumus.
// Mendukung: angka, + − × ÷ (juga * / -), kurung, dan minus di depan.

const OPS = { '*': '×', '/': '÷', '-': '−' };

/** Ubah teks "12,5 × (3 + 4)" menjadi token. */
export function tokenize(text) {
  const re = /\d+(?:[.,]\d+)?|[+\-−×÷*/()]/g;
  return (String(text).match(re) || []).map((t) => OPS[t] ?? t.replace(',', '.'));
}

/** Hitung array token. Mengembalikan NaN bila ekspresi tidak sah. */
export function evaluateTokens(tokens) {
  let i = 0;
  const peek = () => tokens[i];
  const next = () => tokens[i++];

  function expr() {
    let v = term();
    while (peek() === '+' || peek() === '−') {
      const op = next();
      const r = term();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  }
  function term() {
    let v = factor();
    while (peek() === '×' || peek() === '÷') {
      const op = next();
      const r = factor();
      v = op === '×' ? v * r : v / r;
    }
    return v;
  }
  function factor() {
    const t = next();
    if (t === '−') return -factor();
    if (t === '(') {
      const v = expr();
      if (next() !== ')') throw new Error('kurung');
      return v;
    }
    const n = Number(t);
    if (t == null || Number.isNaN(n)) throw new Error('angka');
    return n;
  }

  try {
    if (!tokens.length) return NaN;
    const v = expr();
    if (i !== tokens.length) return NaN;
    return Number.isFinite(v) ? v : NaN;
  } catch {
    return NaN;
  }
}

export const evaluateText = (text) => evaluateTokens(tokenize(text));
