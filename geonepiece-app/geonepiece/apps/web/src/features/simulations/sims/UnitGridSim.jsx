import { useEffect, useRef, useState } from 'react';
import { GeoCanvas, Grid, Handle, Seg, useGeo } from '../canvas/GeoCanvas';
import { HighlightProvider } from '../canvas/highlight';
import { Instruction, LiveFormula, SimCard } from '../canvas/Panels';
import { Icon } from '@/components/ui/Icon';
import { P } from '@/geometry/geometry';
import { clamp } from '@/utils/format';

const BOUNDS = { xmin: -1, xmax: 11, ymin: -1.3, ymax: 7 };

/** S1 — Luas = banyak petak satuan. Isi satu per satu, lalu per baris → p × l. */
export default function UnitGridSim() {
  return (
    <HighlightProvider>
      <UnitGridInner />
    </HighlightProvider>
  );
}

function Cells({ p, l, filled }) {
  const g = useGeo();
  const cells = [];
  for (let i = 0; i < Math.min(filled, p * l); i++) {
    const row = Math.floor(i / p);
    const col = i % p;
    cells.push(
      <rect
        key={`${col}-${row}`}
        x={g.sx(col) + 2}
        y={g.sy(row + 1) + 2}
        width={g.k - 4}
        height={g.k - 4}
        rx={4}
        fill={row % 2 ? '#5eead4' : '#99f6e4'}
        className="animate-pop"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />,
    );
  }
  return <g>{cells}</g>;
}

function UnitGridInner() {
  const [p, setP] = useState(5);
  const [l, setL] = useState(3);
  const [filled, setFilled] = useState(0);
  const timer = useRef(null);
  const total = p * l;

  const stop = () => clearInterval(timer.current);
  useEffect(() => stop, []);
  useEffect(() => {
    stop();
    setFilled(0);
  }, [p, l]);

  const run = (stepSize, ms) => {
    stop();
    setFilled(0);
    timer.current = setInterval(() => {
      setFilled((f) => {
        const n = Math.min(total, f + stepSize);
        if (n >= total) stop();
        return n;
      });
    }, ms);
  };

  const full = filled >= total;
  return (
    <SimCard title="Petak Satuan">
      <Instruction id={full ? 'full' : 'start'}>
        {full
          ? `Ada ${l} baris, setiap baris berisi ${p} petak. Jadi luas = ${p} × ${l} = ${total} petak satuan.`
          : 'Luas adalah banyaknya petak satuan yang menutupi bangun. Seret sudut ● untuk mengubah ukuran, lalu isi petaknya.'}
      </Instruction>
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        <GeoCanvas bounds={BOUNDS} k={40} label={`Persegi panjang ${p} kali ${l} petak`}>
          <Grid {...BOUNDS} />
          <rect x={40} y={(7 - l) * 40} width={p * 40} height={l * 40} fill="#f0fdfa" />
          <Cells p={p} l={l} filled={filled} />
          <Seg a={P(0, 0)} b={P(p, 0)} kind="alas" el="alas" label={`panjang p = ${p}`} labelDy={18} />
          <Seg a={P(0, 0)} b={P(0, l)} kind="tinggi" el="tinggi" label={`l = ${l}`} labelDx={-14} anchor="end" />
          <Seg a={P(0, l)} b={P(p, l)} kind="sisi" />
          <Seg a={P(p, 0)} b={P(p, l)} kind="sisi" />
          <Handle
            at={P(p, l)}
            label="Ubah panjang dan lebar"
            onDrag={(w) => {
              setP(clamp(Math.round(w.x), 1, 10));
              setL(clamp(Math.round(w.y), 1, 6));
            }}
            onNudge={(dx, dy) => {
              setP((v) => clamp(v + dx, 1, 10));
              setL((v) => clamp(v + dy, 1, 6));
            }}
          />
        </GeoCanvas>
      </div>
      <div className="flex items-center justify-between rounded-2xl bg-laut-50 px-4 py-2 font-bold text-laut-900">
        <span>Petak terisi</span>
        <span className="text-2xl tabular-nums">
          {filled} / {total}
        </span>
      </div>
      <LiveFormula tokens={[{ t: 'p', el: 'alas', v: p }, { t: '×' }, { t: 'l', el: 'tinggi', v: l }]} result={total} unit="petak satuan" />
      <div className="flex flex-wrap gap-2">
        <button className="btn-soft" onClick={() => run(1, 90)}>
          <Icon name="play" /> Isi satu per satu
        </button>
        <button className="btn-primary" onClick={() => run(p, 380)}>
          <Icon name="sparkles" /> Isi per baris
        </button>
        <button className="btn-ghost" onClick={() => { stop(); setFilled(0); }}>
          Kosongkan
        </button>
      </div>
      <details className="rounded-2xl bg-pasir-100 p-3">
        <summary className="cursor-pointer font-bold text-amber-900">Satuan luas: cm² dan m²</summary>
        <div className="mt-2 space-y-1 text-slate-700">
          <p>1 m = 100 cm, jadi 1 m² = 100 cm × 100 cm = <b>10.000 cm²</b>.</p>
          <p>Ubah m² → cm²: kalikan 10.000. Ubah cm² → m²: bagi 10.000.</p>
          <p>Sebelum menghitung luas, <b>samakan satuannya dulu</b>.</p>
        </div>
      </details>
    </SimCard>
  );
}
