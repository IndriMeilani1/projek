/*
 * Token tes harian: guru membacakan token di kelas, siswa memasukkannya untuk membuka tes.
 * Dihitung dari (rahasia + kode kelas + jenis tes + tanggal) sehingga sama di semua HP
 * TANPA internet. Ganti VITE_TOKEN_SECRET di file .env sebelum dipakai.
 */
const SECRET = import.meta.env?.VITE_TOKEN_SECRET || 'geonepiece-untirta';
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // tanpa I, L, O, 0, 1 agar tidak tertukar

function fnv1a(str, seed = 0x811c9dc5) {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function localDate(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function testToken(classCode, kind, date = new Date(), secret = SECRET) {
  const base = `${secret}|${String(classCode).trim().toUpperCase()}|${kind}|${localDate(date)}`;
  let out = '';
  let h = fnv1a(base);
  for (let i = 0; i < 6; i++) {
    if (i === 3) h = fnv1a(base, 0x9e3779b1);
    out += ALPHABET[h % ALPHABET.length];
    h = Math.floor(h / ALPHABET.length);
  }
  return out;
}

export const checkToken = (input, classCode, kind) => String(input).trim().toUpperCase() === testToken(classCode, kind);
