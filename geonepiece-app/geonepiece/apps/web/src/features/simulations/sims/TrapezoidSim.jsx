import { useState } from 'react';
import { GeoCanvas, Grid, Label, Poly, RightAngle, Seg } from '../canvas/GeoCanvas';
import { HighlightProvider } from '../canvas/highlight';
import { Instruction, LiveFormula, MeasureChips, SimCard } from '../canvas/Panels';
import { Icon } from '@/components/ui/Icon';
import { Slider } from '@/components/ui';
import { halfTurnCopy, P } from '@/geometry/geometry';
import { haptic, springs } from '@/motion/springs';
import { useTween } from '@/motion/useTween';

const BOUNDS = { xmin: -1, xmax: 18, ymin: -1.9, ymax: 6.6 };
const SHIFT = 1;

/** S5 — Dua trapesium kembar membentuk jajar genjang beralas (a + b). */
export default function TrapezoidSim() {
  return (
    <HighlightProvider>
      <TrapezoidInner />
    </HighlightProvider>
  );
}

function TrapezoidInner() {
  const [a, setA] = useState(7);
  const [top, setTop] = useState(3);
  const [h, setH] = useState(4);
  const [dup, setDup] = useState(false);
  const [turn, setTurn] = useState(0);
  const tween = useTween();

  const A = P(0, 0);
  const B = P(a, 0);
  const C = P(SHIFT + top, h);
  const D = P(SHIFT, h);
  const trap = [A, B, C, D];
  const copy = halfTurnCopy(trap, B, C, turn);
  const done = dup && turn > 0.999;
  const special = top === 0 ? 'b = 0 → trapesium menjadi SEGITIGA! Rumusnya tetap berlaku.' : top === a ? 'b = a → trapesium menjadi JAJAR GENJANG!' : null;

  const phase = !dup ? 'atur' : done ? 'selesai' : 'putar';
  const text = {
    atur: 'Ubah sisi sejajar a (bawah), b (atas), dan tinggi t. Lalu gandakan trapesiumnya.',
    putar: 'Putar salinan 180° pada titik tengah sisi kanan.',
    selesai: `Dua trapesium = jajar genjang dengan alas (a + b) = ${a + top}. Jadi satu trapesium = (a + b) × t ÷ 2.`,
  }[phase];

  return (
    <SimCard title="Trapesium Kembar">
      <Instruction id={phase}>{text}</Instruction>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        <GeoCanvas bounds={BOUNDS} k={34} label={`Trapesium dengan sisi sejajar ${a} dan ${top}, tinggi ${h}`}>
          <Grid {...BOUNDS} />
          {dup && <Poly points={copy} hatch="green" stroke="var(--color-potongan)" strokeWidth={2.5} className="animate-pop" />}
          <Poly points={trap} fill="#c7d2fe" />
          <Seg a={B} b={C} kind="sisi" />
          <Seg a={D} b={A} kind="sisi" />
          <Seg a={A} b={B} kind="alas" el="alas" label={`a = ${a}`} labelDy={18} />
          {top > 0 && <Seg a={D} b={C} kind="alas" el="alas" label={`b = ${top}`} labelDy={-16} />}
          <Seg a={D} b={P(SHIFT, 0)} kind="tinggi" el="tinggi" label={`t = ${h}`} labelDx={24} labelDy={6} />
          <RightAngle foot={P(SHIFT, 0)} />
          {done && (
            <>
              <Poly points={[A, copy[3], copy[0], D]} fill="none" stroke="#154c7a" strokeWidth={3} dashed />
              <Label at={P((a + top) / 2, -1.2)} color="#154c7a" size={14}>
                alas jajar genjang = a + b = {a + top}
              </Label>
            </>
          )}
        </GeoCanvas>
      </div>
      {special && <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800 ring-1 ring-amber-200">{special}</p>}
      <div className="grid gap-2 sm:grid-cols-3">
        <Slider label="Sisi sejajar a" el="alas" value={a} min={3} max={8} onChange={(v) => { setA(v); setTop((t) => Math.min(t, v)); }} />
        <Slider label="Sisi sejajar b" el="alas" value={top} min={0} max={a} onChange={setTop} />
        <Slider label="Tinggi t" el="tinggi" value={h} min={2} max={5} onChange={setH} />
      </div>
      <MeasureChips items={[{ label: 'a', v: a, el: 'alas' }, { label: 'b', v: top, el: 'alas' }, { label: 't', v: h, el: 'tinggi' }]} />
      <LiveFormula
        tokens={[{ t: '(' }, { t: 'a', el: 'alas', v: a }, { t: '+' }, { t: 'b', el: 'alas', v: top }, { t: ')' }, { t: '×' }, { t: 't', el: 'tinggi', v: h }, { t: '÷' }, { t: '2', v: 2 }]}
        result={((a + top) * h) / 2}
      />
      <div className="flex flex-wrap gap-2">
        {!dup && (
          <button className="btn-primary" onClick={() => setDup(true)}>
            <Icon name="sparkles" /> Gandakan trapesium
          </button>
        )}
        {phase === 'putar' && (
          <button className="btn-primary" onClick={() => tween(springs.turn, setTurn, () => haptic())}>
            <Icon name="refresh" /> Putar 180°
          </button>
        )}
        {dup && (
          <button className="btn-ghost" onClick={() => tween(springs.gentle, (t) => setTurn((v) => v * (1 - t)), () => setDup(false))}>
            <Icon name="undo" /> Ulangi
          </button>
        )}
      </div>
    </SimCard>
  );
}
