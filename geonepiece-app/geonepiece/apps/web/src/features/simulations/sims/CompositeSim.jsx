import { useState } from 'react';
import { motion } from 'motion/react';
import { GeoCanvas, Grid, Label, Poly, useGeo } from '../canvas/GeoCanvas';
import { HighlightProvider } from '../canvas/highlight';
import { Instruction, SimCard } from '../canvas/Panels';
import { Tabs } from '@/components/ui';
import { P } from '@/geometry/geometry';

const BOUNDS = { xmin: -1.5, xmax: 10.5, ymin: -1.2, ymax: 8 };
const rect = (x0, y0, x1, y1) => [P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)];
const L_SHAPE = [P(0, 0), P(8, 0), P(8, 3), P(3, 3), P(3, 6), P(0, 6)];

const MODES = {
  utuh: {
    label: 'Bangun utuh',
    text: 'Denah ini berbentuk huruf L. Tidak ada rumus langsung untuk bangun L — kita pecah atau kurangi.',
    pieces: [],
    expr: 'L = ?',
  },
  pecahA: {
    label: 'Pecah tegak',
    text: 'Potong secara tegak: persegi panjang 3 × 6 dan 5 × 3.',
    pieces: [
      { pts: rect(0, 0, 3, 6), off: { x: -0.5, y: 0 }, fill: '#93c5fd', name: '3 × 6 = 18', at: P(1.5, 3) },
      { pts: rect(3, 0, 8, 3), off: { x: 0.5, y: 0 }, fill: '#fcd34d', name: '5 × 3 = 15', at: P(5.5, 1.5) },
    ],
    expr: 'L = 18 + 15 = 33 satuan²',
  },
  pecahB: {
    label: 'Pecah mendatar',
    text: 'Potong secara mendatar: persegi panjang 8 × 3 dan 3 × 3.',
    pieces: [
      { pts: rect(0, 0, 8, 3), off: { x: 0, y: -0.5 }, fill: '#93c5fd', name: '8 × 3 = 24', at: P(4, 1.5) },
      { pts: rect(0, 3, 3, 6), off: { x: 0, y: 0.5 }, fill: '#fcd34d', name: '3 × 3 = 9', at: P(1.5, 4.5) },
    ],
    expr: 'L = 24 + 9 = 33 satuan²',
  },
  kurangi: {
    label: 'Kurangi',
    text: 'Lengkapi menjadi persegi panjang 8 × 6, lalu kurangi bagian yang kosong 5 × 3.',
    pieces: [
      { pts: rect(0, 0, 8, 6), off: { x: 0, y: 0 }, fill: '#bfdbfe', name: '8 × 6 = 48', at: P(1.5, 1.2) },
      { pts: rect(3, 3, 8, 6), off: { x: 0.6, y: 0.9 }, hatch: 'red', name: '− 15', at: P(5.5, 4.5) },
    ],
    expr: 'L = 48 − 15 = 33 satuan²',
  },
};

/** S7 — Bangun gabungan: tiga strategi, hasil sama. */
export default function CompositeSim() {
  return (
    <HighlightProvider>
      <CompositeInner />
    </HighlightProvider>
  );
}

function Piece({ piece }) {
  const g = useGeo();
  return (
    <motion.g initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: piece.off.x * g.k, y: -piece.off.y * g.k, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
      <Poly points={piece.pts} fill={piece.fill} hatch={piece.hatch} stroke="#334155" strokeWidth={2.5} />
      <Label at={piece.at} size={15}>
        {piece.name}
      </Label>
    </motion.g>
  );
}

function CompositeInner() {
  const [mode, setMode] = useState('utuh');
  const cfg = MODES[mode];
  return (
    <SimCard title="Bangun Gabungan">
      <Tabs tabs={Object.entries(MODES).map(([id, m]) => ({ id, label: m.label }))} value={mode} onChange={setMode} />
      <Instruction id={mode}>{cfg.text}</Instruction>
      <div className="mx-auto max-w-lg overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        <GeoCanvas bounds={BOUNDS} k={36} label="Bangun gabungan berbentuk huruf L">
          <Grid {...BOUNDS} />
          {mode === 'utuh' || mode === 'kurangi' ? <Poly points={L_SHAPE} fill={mode === 'utuh' ? '#bae6fd' : 'none'} stroke="#334155" strokeWidth={2.5} /> : null}
          <g key={mode}>
            {cfg.pieces.map((pc, i) => (
              <Piece key={i} piece={pc} />
            ))}
          </g>
          <Label at={P(4, 0)} dy={18} color="var(--color-alas)">8</Label>
          <Label at={P(0, 3)} dx={-14} color="var(--color-tinggi)">6</Label>
          <Label at={P(5.5, 3)} dy={-12} size={13} color="#475569">5</Label>
          <Label at={P(3, 4.5)} dx={12} size={13} color="#475569">3</Label>
        </GeoCanvas>
      </div>
      <p className="rounded-2xl bg-slate-50 p-3 text-center text-xl font-extrabold text-laut-900 ring-1 ring-slate-200">{cfg.expr}</p>
      {mode !== 'utuh' && <p className="text-sm text-slate-600">Coba ketiga strategi: hasilnya selalu sama, yaitu 33 satuan². Pilih cara yang paling mudah bagimu.</p>}
    </SimCard>
  );
}
