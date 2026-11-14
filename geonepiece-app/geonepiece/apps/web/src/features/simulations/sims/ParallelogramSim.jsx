import { useEffect, useRef, useState } from 'react';
import { GeoCanvas, Grid, Handle, Label, Poly, RightAngle, Seg, useDrag } from '../canvas/GeoCanvas';
import { HighlightProvider } from '../canvas/highlight';
import { Instruction, LiveFormula, MeasureChips, SimCard, Toast } from '../canvas/Panels';
import { Icon } from '@/components/ui/Icon';
import { cutParallelogram, distance, parallelogram, translate } from '@/geometry/geometry';
import { clamp, fmt, roundTo } from '@/utils/format';
import { haptic, springs } from '@/motion/springs';
import { useTween } from '@/motion/useTween';

const BOUNDS = { xmin: -0.8, xmax: 16.6, ymin: -1.8, ymax: 7.2 };
const PARK = { x: -0.5, y: 0.35 }; // posisi potongan setelah "terlepas"

const TEXT = {
  atur: 'Seret titik ● untuk mengubah alas, tinggi, dan kemiringan. Ketuk garis untuk menyorotnya. Perhatikan: sisi miring BUKAN tinggi!',
  potong: 'Geser garis potong ✂️ (selalu tegak lurus alas), lalu tekan "Potong".',
  geser: 'Seret potongan hijau ke sisi kanan sampai menempel.',
  selesai: 'Jajar genjang berubah menjadi persegi panjang dengan alas dan tinggi yang sama. Luasnya tidak berubah!',
};

/** S2 — Jajar genjang dipotong, digeser, menjadi persegi panjang. */
export default function ParallelogramSim() {
  return (
    <HighlightProvider>
      <ParallelogramInner />
    </HighlightProvider>
  );
}

function ParallelogramInner() {
  const [b, setB] = useState(6);
  const [h, setH] = useState(4);
  const [s, setS] = useState(2);
  const [phase, setPhase] = useState('atur');
  const [c, setC] = useState(2);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const [sameArea, setSameArea] = useState(false);
  const offRef = useRef(off);
  offRef.current = off;
  const dragFrom = useRef(off);
  const tween = useTween();

  // Saat hanya kemiringan berubah → tampilkan "Luas tetap!"
  const firstS = useRef(true);
  useEffect(() => {
    if (firstS.current) {
      firstS.current = false;
      return;
    }
    setSameArea(true);
    const t = setTimeout(() => setSameArea(false), 1600);
    return () => clearTimeout(t);
  }, [s]);

  const moveTo = (to, spring, done) => {
    const from = offRef.current;
    tween(spring, (t) => setOff({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }), done);
  };

  const canCut = s <= b;
  const area = b * h;
  const side = Math.hypot(s, h);
  const [A, B, C, D] = parallelogram(b, h, s);
  const { left, right, target } = cutParallelogram(b, h, s, c);
  const leftMoved = translate(left, off.x, off.y);

  const startCut = () => {
    setC(s);
    setPhase('potong');
  };
  const doCut = () => {
    setPhase('geser');
    moveTo(PARK, springs.detach);
  };
  const finishSnap = () => {
    haptic();
    setPhase('selesai');
  };
  const onPieceEnd = () => {
    if (distance(offRef.current, target) < 0.8) moveTo(target, springs.snap, finishSnap);
    else moveTo(PARK, springs.return);
  };
  const pieceDrag = useDrag({
    onStart: () => {
      dragFrom.current = offRef.current;
    },
    onMove: (_w, d) => setOff({ x: dragFrom.current.x + d.dx, y: dragFrom.current.y + d.dy }),
    onEnd: onPieceEnd,
  });
  const reset = () => moveTo({ x: 0, y: 0 }, springs.return, () => setPhase('atur'));
  const randomShape = () => {
    const nb = 3 + Math.floor(Math.random() * 5);
    setB(nb);
    setH(2 + Math.floor(Math.random() * 4));
    setS(Math.floor(Math.random() * (nb - 1)) + 1);
    setOff({ x: 0, y: 0 });
    setPhase('atur');
  };

  const whole = phase === 'atur' || phase === 'potong';
  const foot = { x: s, y: 0 };

  return (
    <SimCard title="Jajar Genjang → Persegi Panjang">
      <Instruction id={phase}>{TEXT[phase]}</Instruction>

      <div className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        <GeoCanvas bounds={BOUNDS} k={34} label={`Jajar genjang dengan alas ${b} dan tinggi ${h}`}>
          <Grid {...BOUNDS} />

          {whole && (
            <>
              <Poly points={[A, B, C, D]} />
              {phase === 'potong' && <Poly points={left} hatch="green" stroke="none" opacity={0.85} />}
              <Seg a={B} b={C} kind="sisi" el="sisi" label={`sisi miring ≈ ${fmt(side)}`} labelDx={12} anchor="start" />
              <Seg a={D} b={A} kind="sisi" el="sisi" />
              <Seg a={D} b={C} kind="sisi" />
              <Seg a={A} b={B} kind="alas" el="alas" label={`alas a = ${b}`} labelDy={18} />
              {s > b && <Seg a={B} b={foot} kind="bantu" />}
              <Seg a={D} b={foot} kind="tinggi" el="tinggi" label={`t = ${h}`} labelDx={26} />
              <RightAngle foot={foot} u={{ x: s > b ? -1 : 1, y: 0 }} />
              {s > b && (
                <Label at={{ x: (b + s) / 2, y: 0 }} dy={36} color="var(--color-tinggi)" size={13}>
                  tinggi jatuh di luar alas
                </Label>
              )}
            </>
          )}

          {phase === 'atur' && (
            <>
              <Handle
                at={B}
                label="Ubah panjang alas"
                color="var(--color-alas)"
                onDrag={(w) => setB(clamp(Math.round(w.x), 2, 8))}
                onNudge={(dx) => setB((v) => clamp(v + dx, 2, 8))}
              />
              <Handle
                at={D}
                label="Ubah tinggi dan kemiringan"
                color="var(--color-tinggi)"
                onDrag={(w) => {
                  setS(clamp(Math.round(w.x), 0, 7));
                  setH(clamp(Math.round(w.y), 1, 6));
                }}
                onNudge={(dx, dy) => {
                  setS((v) => clamp(v + dx, 0, 7));
                  setH((v) => clamp(v + dy, 1, 6));
                }}
              />
            </>
          )}

          {phase === 'potong' && (
            <>
              <Seg a={{ x: c, y: -0.3 }} b={{ x: c, y: h + 0.3 }} kind="potong" />
              <Label at={{ x: c, y: h + 0.7 }}>✂️</Label>
              <Handle
                at={{ x: c, y: h / 2 }}
                label="Geser garis potong"
                color="var(--color-tinggi)"
                onDrag={(w) => setC(clamp(roundTo(w.x, 0.5), s, b))}
                onNudge={(dx) => setC((v) => clamp(v + dx * 0.5, s, b))}
              />
            </>
          )}

          {!whole && (
            <>
              <Poly points={right} />
              {phase === 'geser' && <Poly points={translate(left, target.x, target.y)} fill="none" stroke="var(--color-potongan)" dashed strokeWidth={2} />}
              <g
                {...(phase === 'geser' ? pieceDrag : {})}
                className={phase === 'geser' ? 'cursor-grab active:cursor-grabbing' : ''}
                role={phase === 'geser' ? 'button' : undefined}
                aria-label="Potongan jajar genjang, seret ke kanan"
              >
                <Poly points={leftMoved} hatch="green" stroke="var(--color-potongan)" strokeWidth={2.5} />
              </g>
              {phase === 'selesai' && (
                <>
                  <Seg a={{ x: c, y: 0 }} b={{ x: b + c, y: 0 }} kind="alas" el="alas" label={`alas a = ${b}`} labelDy={18} />
                  <Seg a={{ x: b + c, y: 0 }} b={{ x: b + c, y: h }} kind="tinggi" el="tinggi" label={`t = ${h}`} labelDx={26} />
                  <RightAngle foot={{ x: b + c, y: 0 }} u={{ x: -1, y: 0 }} />
                  <Label at={{ x: c + b / 2, y: h / 2 }} color="#154c7a" size={18}>
                    persegi panjang
                  </Label>
                </>
              )}
            </>
          )}
        </GeoCanvas>
        <div className="pointer-events-none absolute right-3 top-3">
          <Toast show={sameArea && phase === 'atur'}>✓ Alas & tinggi tetap → luas tetap {area}</Toast>
        </div>
      </div>

      <MeasureChips
        items={[
          { label: 'alas', v: b, el: 'alas' },
          { label: 'tinggi', v: h, el: 'tinggi' },
          { label: 'sisi miring', v: side, el: 'sisi' },
        ]}
      />
      <LiveFormula
        tokens={[
          { t: 'a', el: 'alas', v: b },
          { t: '×' },
          { t: 't', el: 'tinggi', v: h },
        ]}
        result={area}
      />

      <div className="flex flex-wrap gap-2">
        {phase === 'atur' && (
          <>
            <button className="btn-primary" onClick={startCut} disabled={!canCut}>
              <Icon name="scissors" /> Lanjut: Potong
            </button>
            <button className="btn-soft" onClick={randomShape}>
              <Icon name="refresh" /> Bentuk baru
            </button>
            {!canCut && (
              <p className="w-full text-sm font-semibold text-amber-700">
                Jajar genjang ini sangat miring: garis tinggi jatuh di luar alas, jadi satu potongan tegak tidak cukup. Kurangi kemiringannya dulu.
              </p>
            )}
          </>
        )}
        {phase === 'potong' && (
          <>
            <button className="btn-primary" onClick={doCut}>
              <Icon name="scissors" /> Potong
            </button>
            <button className="btn-ghost" onClick={() => setPhase('atur')}>
              Kembali
            </button>
          </>
        )}
        {phase === 'geser' && (
          <>
            <button className="btn-soft" onClick={() => moveTo(target, springs.snap, finishSnap)}>
              <Icon name="play" /> Bantu geser
            </button>
            <button className="btn-ghost" onClick={reset}>
              Ulangi
            </button>
          </>
        )}
        {phase === 'selesai' && (
          <>
            <button className="btn-soft" onClick={reset}>
              <Icon name="undo" /> Kembalikan
            </button>
            <button className="btn-primary" onClick={randomShape}>
              <Icon name="refresh" /> Coba bentuk lain
            </button>
          </>
        )}
      </div>
    </SimCard>
  );
}
