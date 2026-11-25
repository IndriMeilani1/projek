/*
 * Safety net for the RMT tutor: the AI must never reveal the final answer of an unsolved item.
 * Even with a strict system prompt, models occasionally leak it, so every reply is filtered:
 * any standalone occurrence of the answer number (plain, Indonesian or English formatting) becomes "…".
 */

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** All common written forms of a number, e.g. 12000 → ["12000", "12.000", "12,000"]; 0.3 → ["0.3", "0,3"]. */
export function numberForms(n) {
  const forms = new Set([String(n), String(n).replace('.', ',')]);
  forms.add(new Intl.NumberFormat('id-ID', { maximumFractionDigits: 6 }).format(n));
  forms.add(new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(n));
  return [...forms];
}

/** Replace the final answer in `text` with "…". Numbers that merely contain it (e.g. 1440 for 144) are kept. */
export function maskAnswer(text, answer) {
  if (!text || answer == null || !Number.isFinite(answer)) return text;
  let out = text;
  // Longest form first so "12.000" is masked before "12".
  for (const f of numberForms(answer).sort((a, b) => b.length - a.length)) {
    const re = new RegExp(`(^|[^\\d.,])${escapeRe(f)}(?![\\d]|[.,]\\d)`, 'g');
    out = out.replace(re, '$1…');
  }
  return out;
}
