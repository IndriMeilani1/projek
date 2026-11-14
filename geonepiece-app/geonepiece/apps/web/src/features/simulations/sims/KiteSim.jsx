import { useState } from 'react';
import { GeoCanvas, Grid, Handle, Label, Poly, Seg } from '../canvas/GeoCanvas';
import { HighlightProvider } from '../canvas/highlight';
import { Instruction, LiveFormula, MeasureChips, SimCard } from '../canvas/Panels';
import { Icon } from '@/components/ui/Icon';
import { Slider } from '@/components/ui';
import { halfTurnCopy, kite, kiteOuterTriangles, P } from '@/geometry/geometry';
import { clamp, roundTo } from '@/utils/format';
import { haptic, springs } from '@/motion/springs';
import { useTween } from '@/motion/useTween';

const BOUNDS = { xmin: -1.5, xmax: 11.5, ymin: -1.2, ymax: 11 };

/** S6 — Layang-layang & belah ketupat = setengah persegi panjang d₁ × d₂. */
export default function KiteSim() {
  return (
    <HighlightProvider>
      <KiteInner />
    </HighlightProvider>
  );
}

function KiteInner() {
  const [d1, setD1] = useState(6);
  const [d2, setD2] = useState(8);
  const [m, setM] = useState(5.5);
  const [turn, setTurn] = useState(0);
  const tween = useTween();

  const mm = clamp(m, 1, d2 - 1);
  const { T, R, B, L, points } = kite(d1, d2, mm);
  const outer = kiteOuterTriangles(d1, d2, mm);
  const rhombus = Math.abs(mm - d2 / 2) < 0.01;
  const O = P(d1 / 2, mm);
  const done = turn > 0.999;

  const text = done
    ? 'Keempat segitiga di luar tepat menutupi bangun. Jadi luas bangun = setengah persegi panjang d₁ × d₂.'
    : 'Bangun ini berada di dalam persegi panjang d₁ × d₂ (garis putus-putus). Seret titik ● naik-turun untuk mengubah layang-layang ↔ belah ketupat, lalu masukkan potongan hijau.';

  return (
    <SimCard title="Layang-layang & Belah Ketupat">
      <Instruction id={done ? 'done' : 'start'}>{text}</Instruction>
      <div className="mx-auto max-w-md overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        <GeoCanvas bounds={BOUNDS} k={30} label={`${rhombus ? 'Belah ketupat' : 'Layang-layang'} dengan diagonal ${d1} dan ${d2}`}>
          <Grid {...BOUNDS} />
          <Poly points={[P(0, 0), P(d1, 0), P(d1, d2), P(0, d2)]} fill="none" stroke="#94a3b8" dashed />
          <Poly points={points} fill="#e9d5ff" />
          {outer.map((tri, i) => (
            <Poly key={i} points={halfTurnCopy(tri.pts, tri.edge[0], tri.edge[1], turn)} hatch="green" stroke="var(--color-potongan)" strokeWidth={2} opacity={0.9} />
          ))}
          <Seg a={T} b={R} kind="sisi" />
          <Seg a={R} b={B} kind="sisi" />
          <Seg a={B} b={L} kind="sisi" />
          <Seg a={L} b={T} kind="sisi" />
          <Seg a={L} b={R} kind="diagonal" el="diagonal" label={`d₁ = ${d1}`} labelDy={-14} labelDx={d1 * 7} />
          <Seg a={T} b={B} kind="diagonal" el="diagonal" label={`d₂ = ${d2}`} labelDx={-30} labelDy={mm < d2 / 2 ? -40 : 40} />
          <Label at={P(d1 / 2, d2)} dy={-14} color={rhombus ? '#7c3aed' : '#154c7a'} size={14}>
            {rhombus ? 'belah ketupat' : 'layang-layang'}
          </Label>
          {turn === 0 && (
            <Handle
              at={O}
              label="Geser titik potong diagonal"
              color="var(--color-diagonal)"
              onDrag={(w) => setM(clamp(roundTo(w.y, 0.5), 1, d2 - 1))}
              onNudge={(_dx, dy) => setM((v) => clamp(v + dy * 0.5, 1, d2 - 1))}
            />
          )}
        </GeoCanvas>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Slider label="Diagonal d₁ (mendatar)" el="diagonal" value={d1} min={4} max={10} onChange={setD1} />
        <Slider label="Diagonal d₂ (tegak)" el="diagonal" value={d2} min={4} max={10} onChange={(v) => { setD2(v); setM((x) => clamp(x, 1, v - 1)); }} />
      </div>
      <MeasureChips items={[{ label: 'd₁', v: d1, el: 'diagonal' }, { label: 'd₂', v: d2, el: 'diagonal' }]} />
      <LiveFormula tokens={[{ t: 'd₁', el: 'diagonal', v: d1 }, { t: '×' }, { t: 'd₂', el: 'diagonal', v: d2 }, { t: '÷' }, { t: '2', v: 2 }]} result={(d1 * d2) / 2} />
      <div className="flex flex-wrap gap-2">
        {!done ? (
          <button className="btn-primary" onClick={() => tween(springs.turn, setTurn, () => haptic())}>
            <Icon name="play" /> Masukkan potongan hijau
          </button>
        ) : (
          <button className="btn-soft" onClick={() => tween(springs.gentle, (t) => setTurn(1 - t))}>
            <Icon name="undo" /> Keluarkan lagi
          </button>
        )}
        <button className="btn-ghost" onClick={() => setM(d2 / 2)}>
          Jadikan belah ketupat
        </button>
      </div>
    </SimCard>
  );
}
