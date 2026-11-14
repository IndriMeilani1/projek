import { useState } from 'react';
import { GeoCanvas, Grid, Handle, Label, Poly, RightAngle, Seg } from '../canvas/GeoCanvas';
import { HighlightProvider } from '../canvas/highlight';
import { Instruction, LiveFormula, MeasureChips, SimCard } from '../canvas/Panels';
import { Icon } from '@/components/ui/Icon';
import { Slider } from '@/components/ui';
import { halfTurnCopy, P } from '@/geometry/geometry';
import { clamp, roundTo } from '@/utils/format';
import { haptic, springs } from '@/motion/springs';
import { useTween } from '@/motion/useTween';

const BOUNDS = { xmin: -3.6, xmax: 18.4, ymin: -2, ymax: 7.2 };

/** S4 — Segitiga: puncak bergeser sejajar alas (luas tetap) + Gandakan & Putar. */
export default function TriangleSim() {
  return (
    <HighlightProvider>
      <TriangleInner />
    </HighlightProvider>
  );
}

function TriangleInner() {
  const [b, setB] = useState(6);
  const [h, setH] = useState(4);
  const [px, setPx] = useState(2);
  const [dup, setDup] = useState(false);
  const [turn, setTurn] = useState(0);
  const tween = useTween();

  const A = P(0, 0);
  const B = P(b, 0);
  const Ap = P(px, h);
  const tri = [A, B, Ap];
  const foot = P(px, 0);
  const outside = px < 0 || px > b;
  const copy = halfTurnCopy(tri, B, Ap, turn);
  const done = dup && turn > 0.999;

  const doTurn = () => tween(springs.turn, (t) => setTurn(t), () => haptic());
  const resetTurn = () => tween(springs.gentle, (t) => setTurn((v) => v * (1 - t)), () => setDup(false));

  const phase = !dup ? 'geser' : done ? 'selesai' : 'putar';
  const text = {
    geser: 'Seret puncak ● ke kiri–kanan. Alas dan tinggi tetap, jadi luas segitiga tetap — bahkan saat garis tinggi berada DI LUAR segitiga.',
    putar: 'Sekarang ada dua segitiga yang sama. Putar salinannya 180° pada titik tengah sisi kanan.',
    selesai: 'Dua segitiga yang sama membentuk jajar genjang (L = a × t). Jadi satu segitiga = ½ × a × t.',
  }[phase];

  return (
    <SimCard title="Segitiga: Geser Puncak & Gandakan">
      <Instruction id={phase}>{text}</Instruction>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        <GeoCanvas bounds={BOUNDS} k={28} label={`Segitiga dengan alas ${b} dan tinggi ${h}`}>
          <Grid {...BOUNDS} />
          <Seg a={P(-3, h)} b={P(b + 2, h)} kind="bantu" />
          {dup && (
            <Poly points={copy} hatch="green" stroke="var(--color-potongan)" strokeWidth={2.5} opacity={0.9} className="animate-pop" />
          )}
          <Poly points={tri} fill="#fde68a" />
          {done && <Poly points={[A, B, copy[0], Ap]} fill="none" stroke="#154c7a" strokeWidth={3} dashed />}
          <Seg a={B} b={Ap} kind="sisi" />
          <Seg a={A} b={Ap} kind="sisi" />
          <Seg a={A} b={B} kind="alas" el="alas" label={`alas a = ${b}`} labelDy={18} />
          {px < 0 && <Seg a={foot} b={A} kind="bantu" />}
          {px > b && <Seg a={B} b={foot} kind="bantu" />}
          <Seg a={Ap} b={foot} kind="tinggi" el="tinggi" label={`t = ${h}`} labelDx={px < b / 2 ? -26 : 26} />
          <RightAngle foot={foot} u={{ x: px > b ? -1 : 1, y: 0 }} />
          {outside && (
            <Label at={foot} dy={38} color="var(--color-tinggi)" size={13}>
              tinggi di luar segitiga
            </Label>
          )}
          {done && (
            <Label at={P((b + px) / 2 + b / 4, h / 2)} color="#154c7a" size={16}>
              jajar genjang
            </Label>
          )}
          {!dup && (
            <Handle
              at={Ap}
              label="Geser puncak segitiga"
              color="var(--color-tinggi)"
              onDrag={(w) => setPx(clamp(roundTo(w.x, 0.5), -3, b + 2))}
              onNudge={(dx) => setPx((v) => clamp(v + dx * 0.5, -3, b + 2))}
            />
          )}
        </GeoCanvas>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Slider label="Alas" el="alas" value={b} min={2} max={8} onChange={(v) => { setB(v); setPx((p) => clamp(p, -3, v + 2)); }} />
        <Slider label="Tinggi" el="tinggi" value={h} min={1} max={6} onChange={setH} />
      </div>
      <MeasureChips items={[{ label: 'alas', v: b, el: 'alas' }, { label: 'tinggi', v: h, el: 'tinggi' }]} />
      <LiveFormula
        tokens={[{ t: '½', v: 0.5 }, { t: '×' }, { t: 'a', el: 'alas', v: b }, { t: '×' }, { t: 't', el: 'tinggi', v: h }]}
        result={(b * h) / 2}
      />
      <div className="flex flex-wrap gap-2">
        {!dup && (
          <button className="btn-primary" onClick={() => setDup(true)}>
            <Icon name="sparkles" /> Gandakan segitiga
          </button>
        )}
        {phase === 'putar' && (
          <button className="btn-primary" onClick={doTurn}>
            <Icon name="refresh" /> Putar 180°
          </button>
        )}
        {dup && (
          <button className="btn-ghost" onClick={resetTurn}>
            <Icon name="undo" /> Ulangi
          </button>
        )}
      </div>
    </SimCard>
  );
}
