import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '@/components/ui';

/*
 * Pembaca Soal: siswa mengetuk kalimat untuk menandainya sebagai
 * Diketahui → Ditanya → Tidak diperlukan → (hapus). Tabel Diketahui/Ditanya terisi otomatis.
 * Mengatasi temuan EL01/EL05 (soal cerita panjang & berbelit) dan melatih proses MERUMUSKAN.
 */
export const TAGS = {
  diketahui: { label: 'Diketahui', cls: 'bg-sky-100 ring-sky-300 text-sky-900' },
  ditanya: { label: 'Ditanya', cls: 'bg-amber-100 ring-amber-300 text-amber-900' },
  tidak: { label: 'Tidak diperlukan', cls: 'bg-slate-100 ring-slate-200 text-slate-400 line-through' },
};
const CYCLE = [undefined, 'diketahui', 'ditanya', 'tidak'];

export function ProblemReader({ sentences, marks = {}, onChange, showTable = true }) {
  const texts = sentences.map((s) => (typeof s === 'string' ? s : s.text));
  const tap = (i) => {
    const next = CYCLE[(CYCLE.indexOf(marks[i]) + 1) % CYCLE.length];
    const m = { ...marks };
    if (next) m[i] = next;
    else delete m[i];
    onChange(m);
  };
  const known = texts.filter((_, i) => marks[i] === 'diketahui');
  const asked = texts.filter((_, i) => marks[i] === 'ditanya');

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
        <Icon name="highlighter" size={16} /> Ketuk kalimat untuk menandai: Diketahui → Ditanya → Tidak diperlukan
      </p>
      <p className="text-lg leading-relaxed">
        {texts.map((t, i) => (
          <button
            key={i}
            type="button"
            onClick={() => tap(i)}
            className={`mr-1 rounded-lg px-1 py-0.5 text-left ring-1 transition ${marks[i] ? TAGS[marks[i]].cls : 'ring-transparent hover:bg-yellow-50'}`}
          >
            {t}
          </button>
        ))}
      </p>
      {showTable && (known.length > 0 || asked.length > 0) && (
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ['Diketahui', known, 'bg-sky-50 ring-sky-200'],
            ['Ditanya', asked, 'bg-amber-50 ring-amber-200'],
          ].map(([title, list, cls]) => (
            <div key={title} className={`rounded-2xl p-3 ring-1 ${cls}`}>
              <p className="mb-1 text-sm font-extrabold">{title}</p>
              <ul className="space-y-1 text-sm">
                <AnimatePresence initial={false}>
                  {list.map((t) => (
                    <motion.li key={t} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                      • {t}
                    </motion.li>
                  ))}
                </AnimatePresence>
                {list.length === 0 && <li className="text-slate-400">—</li>}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Umpan balik penandaan (hanya di latihan, TIDAK dipakai di tes). */
export function checkMarks(sentences, marks) {
  const missingKnown = [];
  let missingAsked = false;
  let wrongUseless = 0;
  sentences.forEach((s, i) => {
    if (s.tag === 'diketahui' && marks[i] !== 'diketahui') missingKnown.push(s.text);
    if (s.tag === 'ditanya' && marks[i] !== 'ditanya') missingAsked = true;
    if (s.tag === 'tidak' && (marks[i] === 'diketahui' || marks[i] === 'ditanya')) wrongUseless++;
  });
  if (!missingKnown.length && !missingAsked && !wrongUseless) return { ok: true, msg: 'Penandaanmu tepat! Sekarang informasinya sudah rapi.' };
  const parts = [];
  if (missingKnown.length) parts.push(`Masih ada informasi penting yang belum ditandai "Diketahui".`);
  if (missingAsked) parts.push('Tandai kalimat pertanyaannya sebagai "Ditanya".');
  if (wrongUseless) parts.push('Ada kalimat yang sebenarnya tidak diperlukan untuk menjawab.');
  return { ok: false, msg: parts.join(' ') };
}
