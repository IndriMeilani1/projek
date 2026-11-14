import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ShapeIcon, SHAPE_NAMES } from '@/components/ui/ShapeIcon';
import { Feedback, Icon } from '@/components/ui';

/*
 * Diagram Venn "Keluarga Segiempat" — membantu siswa MENGENALI BANGUN sebelum memilih rumus
 * (temuan wawancara K03/IL02: siswa ragu memakai rumus yang mana).
 *
 * Himpunan (definisi yang dipakai):
 *  JG = jajar genjang  : dua pasang sisi berhadapan sejajar
 *  PP = persegi panjang: jajar genjang dengan empat sudut siku-siku
 *  LL = layang-layang  : dua pasang sisi berdekatan sama panjang
 *  TR = trapesium      : TEPAT sepasang sisi sejajar (definisi eksklusif; lihat catatan di layar)
 * Akibatnya: belah ketupat = JG ∩ LL, persegi = PP ∩ LL.
 */

const SETS = {
  JG: { name: 'Jajar genjang', cx: 300, cy: 250, rx: 205, ry: 150, color: '#2563eb', label: { x: 300, y: 122 }, prop: 'dua pasang sisi berhadapan yang sejajar' },
  PP: { name: 'Persegi panjang', cx: 275, cy: 250, rx: 170, ry: 82, color: '#ea580c', label: { x: 215, y: 212 }, prop: 'empat sudut siku-siku' },
  LL: { name: 'Layang-layang', cx: 545, cy: 250, rx: 160, ry: 120, color: '#7c3aed', label: { x: 622, y: 170 }, prop: 'dua pasang sisi berdekatan yang sama panjang' },
  TR: { name: 'Trapesium', cx: 615, cy: 70, rx: 80, ry: 42, color: '#16a34a', label: { x: 615, y: 45 }, prop: 'tepat sepasang sisi sejajar' },
};

const SHAPES = [
  { id: 'persegi', sets: ['JG', 'PP', 'LL'], at: { x: 416, y: 262 }, formula: 'L = s × s', fact: 'Persegi adalah persegi panjang sekaligus belah ketupat.' },
  { id: 'persegi-panjang', sets: ['JG', 'PP'], at: { x: 245, y: 262 }, formula: 'L = p × l', fact: 'Persegi panjang adalah jajar genjang yang semua sudutnya siku-siku.' },
  { id: 'belah-ketupat', sets: ['JG', 'LL'], at: { x: 446, y: 186 }, formula: 'L = d₁ × d₂ ÷ 2', fact: 'Belah ketupat adalah jajar genjang sekaligus layang-layang.' },
  { id: 'jajar-genjang', sets: ['JG'], at: { x: 330, y: 150 }, formula: 'L = a × t', fact: 'Tinggi jajar genjang selalu tegak lurus alas — bukan sisi miringnya.' },
  { id: 'layang-layang', sets: ['LL'], at: { x: 610, y: 262 }, formula: 'L = d₁ × d₂ ÷ 2', fact: 'Luasnya setengah persegi panjang yang dibentuk kedua diagonal.' },
  { id: 'trapesium', sets: ['TR'], at: { x: 600, y: 82 }, formula: 'L = (a + b) × t ÷ 2', fact: 'Dua trapesium kembar membentuk jajar genjang beralas (a + b).' },
  { id: 'sembarang', sets: [], at: { x: 70, y: 418 }, formula: 'Pecah menjadi segitiga', fact: 'Segiempat sembarang dihitung dengan memecahnya menjadi bangun yang dikenal.' },
];

const inside = (p, s) => ((p.x - s.cx) / s.rx) ** 2 + ((p.y - s.cy) / s.ry) ** 2 <= 1;
const membership = (p) => Object.keys(SETS).filter((k) => inside(p, SETS[k]));
const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

function reason(shape, tapped) {
  const missing = shape.sets.filter((s) => !tapped.includes(s));
  const extra = tapped.filter((s) => !shape.sets.includes(s));
  const name = SHAPE_NAMES[shape.id];
  if (missing.length) return `${name} memiliki ${SETS[missing[0]].prop}, jadi termasuk ${SETS[missing[0]].name.toLowerCase()}.`;
  if (extra.length) return `${name} tidak memiliki ${SETS[extra[0]].prop}, jadi bukan ${SETS[extra[0]].name.toLowerCase()}.`;
  return 'Coba lagi.';
}

function RegionHighlight({ sets, uid }) {
  const excluded = Object.keys(SETS).filter((k) => !sets.includes(k));
  let node = <rect x="8" y="8" width="704" height="444" fill="#fde047" opacity="0.45" />;
  for (const k of sets) node = <g clipPath={`url(#${uid}-clip-${k})`}>{node}</g>;
  return (
    <motion.g key={sets.join('-') || 'none'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} mask={`url(#${uid}-mask-${sets.join('') || 'none'})`}>
      <mask id={`${uid}-mask-${sets.join('') || 'none'}`}>
        <rect x="0" y="0" width="720" height="460" fill="white" />
        {excluded.map((k) => (
          <ellipse key={k} cx={SETS[k].cx} cy={SETS[k].cy} rx={SETS[k].rx} ry={SETS[k].ry} fill="black" />
        ))}
      </mask>
      {node}
    </motion.g>
  );
}

export default function QuadVenn() {
  const svgRef = useRef(null);
  const uid = 'venn';
  const [selected, setSelected] = useState(null); // id bangun yang akan ditempatkan
  const [placed, setPlaced] = useState([]);
  const [region, setRegion] = useState(null); // himpunan wilayah yang diketuk
  const [msg, setMsg] = useState(null);
  const [wrongTap, setWrongTap] = useState(null);

  const toSvg = (e) => {
    const m = svgRef.current?.getScreenCTM();
    if (!m) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  const onTap = (e) => {
    const p = toSvg(e);
    if (!p) return;
    const tapped = membership(p);
    setRegion(tapped);
    if (!selected) {
      setMsg({ tone: 'info', text: tapped.length ? `Wilayah ini: ${tapped.map((k) => SETS[k].name).join(' ∩ ')}.` : 'Wilayah ini: segiempat yang tidak termasuk keluarga mana pun.' });
      return;
    }
    const shape = SHAPES.find((s) => s.id === selected);
    if (sameSet(shape.sets, tapped)) {
      setPlaced((arr) => [...arr, shape.id]);
      setSelected(null);
      setMsg({ tone: 'ok', text: `Tepat! ${shape.fact} Rumus luas: ${shape.formula}` });
    } else {
      setWrongTap({ ...p, k: Date.now() });
      setMsg({ tone: 'warn', text: reason(shape, tapped) });
    }
  };

  const remaining = SHAPES.filter((s) => !placed.includes(s.id));
  const allDone = remaining.length === 0;
  const regionSets = useMemo(() => region ?? [], [region]);

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden p-2 sm:p-4">
        <svg ref={svgRef} viewBox="0 0 720 460" className="block h-auto w-full touch-manipulation select-none" onPointerUp={onTap} role="img" aria-label="Diagram Venn keluarga segiempat. Ketuk wilayah untuk menempatkan bangun.">
          <defs>
            {Object.entries(SETS).map(([k, s]) => (
              <clipPath key={k} id={`${uid}-clip-${k}`}>
                <ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} />
              </clipPath>
            ))}
          </defs>
          <rect x="8" y="8" width="704" height="444" rx="22" fill="#fffbf2" stroke="#94a3b8" strokeWidth="2" />
          <text x="26" y="40" className="svg-label" fontSize="23" fill="#334155">
            Segiempat
          </text>
          <AnimatePresence>{region && <RegionHighlight key={regionSets.join('-') || 'none'} sets={regionSets} uid={uid} />}</AnimatePresence>
          {Object.entries(SETS).map(([k, s]) => (
            <ellipse
              key={k}
              cx={s.cx}
              cy={s.cy}
              rx={s.rx}
              ry={s.ry}
              fill={s.color}
              fillOpacity={region?.includes(k) ? 0.14 : 0.06}
              stroke={s.color}
              strokeWidth={region?.includes(k) ? 4 : 2.5}
              style={{ transition: 'all 200ms' }}
            />
          ))}
          {Object.entries(SETS).map(([k, s]) => (
            <text key={k} x={s.label.x} y={s.label.y} textAnchor="middle" fontSize="23" fill={s.color} className="svg-label pointer-events-none">
              {s.name}
            </text>
          ))}
          {placed.map((id) => {
            const sh = SHAPES.find((s) => s.id === id);
            return (
              <motion.g key={id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 18 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                <g transform={`translate(${sh.at.x - 23} ${sh.at.y - 42})`}>
                  <ShapeIcon shape={id} size={46} />
                </g>
                <text x={sh.at.x} y={sh.at.y + 20} textAnchor="middle" fontSize="17" className="svg-label pointer-events-none" fill="#0f172a">
                  {SHAPE_NAMES[id]}
                </text>
              </motion.g>
            );
          })}
          {wrongTap && (
            <motion.circle key={wrongTap.k} cx={wrongTap.x} cy={wrongTap.y} r={8} fill="none" stroke="#e11d48" strokeWidth={3} initial={{ r: 4, opacity: 1 }} animate={{ r: 30, opacity: 0 }} transition={{ duration: 0.6 }} />
          )}
        </svg>
      </div>

      {msg && <Feedback tone={msg.tone}>{msg.text}</Feedback>}

      {!allDone ? (
        <div className="card p-4">
          <p className="mb-3 font-bold text-laut-900">
            {selected ? `Ketuk wilayah yang tepat untuk ${SHAPE_NAMES[selected].toLowerCase()} pada diagram.` : 'Pilih sebuah bangun, lalu ketuk wilayahnya pada diagram:'}
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {remaining.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelected(s.id);
                  setMsg(null);
                }}
                className={`flex items-center gap-2 rounded-2xl p-2 text-left font-bold ring-2 transition ${selected === s.id ? 'bg-yellow-50 ring-yellow-400' : 'bg-white ring-slate-200 hover:ring-laut-500'}`}
                aria-pressed={selected === s.id}
              >
                <ShapeIcon shape={s.id} size={36} />
                <span className="text-sm leading-tight">{SHAPE_NAMES[s.id]}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <Feedback tone="ok">
          <b>Semua bangun sudah di tempatnya!</b> Ingat urutannya: <i>kenali bangunnya dulu</i>, baru pilih rumusnya.
          <button className="btn-soft mt-2" onClick={() => { setPlaced([]); setMsg(null); setRegion(null); }}>
            <Icon name="refresh" /> Main lagi
          </button>
        </Feedback>
      )}

      <details className="card p-4 text-sm text-slate-600">
        <summary className="cursor-pointer font-bold text-slate-700">Catatan untuk guru: definisi trapesium</summary>
        <p className="mt-2">
          Diagram ini memakai definisi <b>eksklusif</b> (trapesium memiliki <i>tepat</i> sepasang sisi sejajar), seperti di banyak buku SMP. Pada definisi
          <b> inklusif</b> (paling sedikit sepasang sisi sejajar), lingkaran Jajar genjang berada di dalam Trapesium. Sesuaikan dengan buku yang dipakai di
          kelas.
        </p>
      </details>
    </div>
  );
}
