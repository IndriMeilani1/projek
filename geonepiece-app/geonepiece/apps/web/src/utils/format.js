// Format angka gaya Indonesia: koma desimal, titik ribuan.
const nf = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });
const intf = new Intl.NumberFormat('id-ID');

export const fmt = (n) => (Number.isFinite(n) ? nf.format(Math.round(n * 100) / 100) : '–');
export const rupiah = (n) => `Rp${intf.format(Math.round(n))}`;

/**
 * Membaca angka yang diketik siswa: "1.234,5" · "1234.5" · "7,5" · "Rp216.000" · "288 m²".
 * Mengembalikan NaN bila tidak bisa dibaca.
 */
export function parseNumberId(input) {
  if (input == null) return NaN;
  let s = String(input)
    .trim()
    .toLowerCase()
    .replace(/rp|m²|cm²|m2|cm2|satuan|lembar|buah|kg|bungkus|cm|m\b/g, '')
    .replace(/\s/g, '');
  if (!s) return NaN;
  const hasComma = s.includes(',');
  const dots = (s.match(/\./g) || []).length;
  if (hasComma) s = s.replace(/\./g, '').replace(',', '.');
  else if (dots > 1 || /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const roundTo = (v, step) => Math.round(v / step) * step;
