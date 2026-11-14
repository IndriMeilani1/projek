import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui';

/*
 * Kanvas sketsa untuk jawaban (mendukung proses MERUMUSKAN: "gambar situasinya").
 * Disimpan sebagai PNG dataURL (dikecilkan) setiap selesai satu goresan.
 */
const COLORS = [
  ['#0f172a', 'Hitam'],
  ['#2563eb', 'Biru (alas)'],
  ['#ea580c', 'Oranye (tinggi)'],
  ['#16a34a', 'Hijau (potongan)'],
];
const W = 640;
const H = 360;

export function SketchPad({ value, onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const strokes = useRef([]);
  const [color, setColor] = useState(COLORS[0][0]);
  const [count, setCount] = useState(0);

  // Muat sketsa lama (bila ada) sebagai latar.
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, W, H);
    drawGrid(ctx);
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, W, H);
      img.src = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };

  const down = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drawing.current = true;
    const p = pos(e);
    strokes.current.push({ color, pts: [p] });
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };
  const move = (e) => {
    if (!drawing.current) return;
    const p = pos(e);
    const ctx = canvasRef.current.getContext('2d');
    const s = strokes.current[strokes.current.length - 1];
    s.pts.push(p);
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };
  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    setCount(strokes.current.length);
    onChange(canvasRef.current.toDataURL('image/png'));
  };

  const redraw = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, W, H);
    drawGrid(ctx);
    for (const s of strokes.current) {
      ctx.beginPath();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      s.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
    }
  };
  const undo = () => {
    strokes.current.pop();
    setCount(strokes.current.length);
    redraw();
    onChange(strokes.current.length ? canvasRef.current.toDataURL('image/png') : null);
  };
  const clear = () => {
    strokes.current = [];
    setCount(0);
    redraw();
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {COLORS.map(([c, name]) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            aria-label={`Warna ${name}`}
            aria-pressed={color === c}
            className={`size-9 rounded-full ring-offset-2 transition ${color === c ? 'ring-4 ring-laut-500' : ''}`}
            style={{ background: c }}
          />
        ))}
        <button className="btn-ghost ml-auto" onClick={undo} disabled={!count}>
          <Icon name="undo" /> Batal
        </button>
        <button className="btn-ghost" onClick={clear}>
          <Icon name="trash" /> Hapus
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block w-full touch-none rounded-2xl bg-white ring-2 ring-slate-200"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        aria-label="Kanvas sketsa jawaban"
      />
    </div>
  );
}

function drawGrid(ctx) {
  ctx.strokeStyle = '#eef2f7';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
}
