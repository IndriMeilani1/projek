import { createContext, useContext, useId, useMemo, useRef, useState } from 'react';
import { useHL } from './highlight';

// Kanvas geometri SVG. Koordinat dunia: 1 = 1 petak satuan, y ke atas.
const GeoCtx = createContext(null);
export const useGeo = () => useContext(GeoCtx);

export function GeoCanvas({ bounds, k = 36, label, children, className = '' }) {
  const { xmin, xmax, ymin, ymax } = bounds;
  const svgRef = useRef(null);
  const uid = useId().replace(/:/g, '');
  const W = (xmax - xmin) * k;
  const H = (ymax - ymin) * k;

  const api = useMemo(() => {
    const sx = (x) => (x - xmin) * k;
    const sy = (y) => (ymax - y) * k;
    return {
      k,
      uid,
      fs: Math.max(15, Math.round(W / 30)),
      sx,
      sy,
      pts: (arr) => arr.map((p) => `${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`).join(' '),
      toWorld(clientX, clientY) {
        const svg = svgRef.current;
        const m = svg?.getScreenCTM();
        if (!m) return { x: 0, y: 0 };
        const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
        return { x: p.x / k + xmin, y: ymax - p.y / k };
      },
    };
  }, [k, xmin, ymax, uid]);

  return (
    <GeoCtx.Provider value={api}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={label}
        className={`block h-auto w-full touch-none select-none ${className}`}
      >
        <defs>
          <pattern id={`hatch-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill="#bbf7d0" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#16a34a" strokeWidth="3" opacity="0.55" />
          </pattern>
          <pattern id={`hatch-red-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill="#fecdd3" />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#e11d48" strokeWidth="3" opacity="0.5" />
          </pattern>
        </defs>
        {children}
      </svg>
    </GeoCtx.Provider>
  );
}

/** Pointer drag (jari, mouse, stylus) dalam koordinat dunia. */
export function useDrag({ onStart, onMove, onEnd }) {
  const geo = useGeo();
  const st = useRef(null);
  const finish = (e) => {
    if (!st.current) return;
    st.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    onEnd?.();
  };
  return {
    onPointerDown(e) {
      e.stopPropagation();
      e.currentTarget.setPointerCapture?.(e.pointerId);
      const w = geo.toWorld(e.clientX, e.clientY);
      st.current = { start: w };
      onStart?.(w);
    },
    onPointerMove(e) {
      if (!st.current) return;
      const w = geo.toWorld(e.clientX, e.clientY);
      onMove?.(w, { dx: w.x - st.current.start.x, dy: w.y - st.current.start.y });
    },
    onPointerUp: finish,
    onPointerCancel: finish,
  };
}

export function Grid({ xmin, xmax, ymin, ymax }) {
  const g = useGeo();
  const lines = [];
  for (let x = Math.ceil(xmin); x <= xmax; x++)
    lines.push(<line key={`x${x}`} x1={g.sx(x)} y1={g.sy(ymin)} x2={g.sx(x)} y2={g.sy(ymax)} />);
  for (let y = Math.ceil(ymin); y <= ymax; y++)
    lines.push(<line key={`y${y}`} x1={g.sx(xmin)} y1={g.sy(y)} x2={g.sx(xmax)} y2={g.sy(y)} />);
  return (
    <g stroke="#e2e8f0" strokeWidth="1" aria-hidden="true">
      {lines}
    </g>
  );
}

const KIND = {
  alas: { stroke: 'var(--color-alas)', width: 4.5 },
  tinggi: { stroke: 'var(--color-tinggi)', width: 3.5, dash: '9 6' },
  diagonal: { stroke: 'var(--color-diagonal)', width: 3.5, dash: '1 7', cap: 'round' },
  sisi: { stroke: 'var(--color-sisi)', width: 2.5 },
  bantu: { stroke: '#94a3b8', width: 2, dash: '4 5' },
  potong: { stroke: 'var(--color-tinggi)', width: 3, dash: '12 6' },
};

/** Ruas garis yang bisa diketuk untuk disorot. Label menempel DI DALAM gambar. */
export function Seg({ a, b, kind = 'sisi', el, label, labelDx = 0, labelDy = 0, anchor = 'middle', labelColor }) {
  const g = useGeo();
  const off = g.fs / 15;
  const hl = useHL(el);
  const s = KIND[kind];
  const x1 = g.sx(a.x);
  const y1 = g.sy(a.y);
  const x2 = g.sx(b.x);
  const y2 = g.sy(b.y);
  return (
    <g data-element={el} className={`transition-opacity duration-150 ${hl.isDim ? 'opacity-30' : ''}`}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={s.stroke}
        strokeWidth={s.width * (hl.isActive ? 1.7 : 1)}
        strokeDasharray={s.dash}
        strokeLinecap={s.cap ?? 'butt'}
        className={hl.isActive ? 'hl-glow' : ''}
        style={{ transition: 'stroke-width 150ms ease-out' }}
      />
      {el && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="transparent"
          strokeWidth={22}
          className="cursor-pointer"
          onClick={hl.toggle}
          role="button"
          aria-label={`Sorot ${el}`}
        />
      )}
      {label && (
        <SvgText x={(x1 + x2) / 2 + labelDx * off} y={(y1 + y2) / 2 + labelDy * off} color={labelColor ?? s.stroke} anchor={anchor} big={hl.isActive}>
          {label}
        </SvgText>
      )}
    </g>
  );
}

export function SvgText({ x, y, children, color = '#0f172a', anchor = 'middle', size, big = false }) {
  const g = useGeo();
  const base = g?.fs ?? 15;
  size = size ? (size / 15) * base : base;
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={big ? size * 1.2 : size}
      textAnchor={anchor}
      dominantBaseline="middle"
      className="svg-label pointer-events-none"
      style={{ transition: 'font-size 150ms' }}
    >
      {children}
    </text>
  );
}

/** Label di posisi dunia (x, y) dengan geser piksel opsional. */
export function Label({ at, children, dx = 0, dy = 0, ...rest }) {
  const g = useGeo();
  return (
    <SvgText x={g.sx(at.x) + (dx * g.fs) / 15} y={g.sy(at.y) + (dy * g.fs) / 15} {...rest}>
      {children}
    </SvgText>
  );
}

export function Poly({ points, fill = '#dbeafe', stroke = 'var(--color-sisi)', strokeWidth = 2, dashed, opacity = 1, className = '', hatch, ...rest }) {
  const g = useGeo();
  const f = hatch === 'green' ? `url(#hatch-${g.uid})` : hatch === 'red' ? `url(#hatch-red-${g.uid})` : fill;
  return (
    <polygon
      points={g.pts(points)}
      fill={f}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={dashed ? '6 5' : undefined}
      strokeLinejoin="round"
      opacity={opacity}
      className={className}
      {...rest}
    />
  );
}

/** Tanda siku-siku di kaki garis tinggi. u = arah sepanjang alas, v = arah tinggi (vektor satuan). */
export function RightAngle({ foot, u = { x: 1, y: 0 }, v = { x: 0, y: 1 }, size = 0.35, color = 'var(--color-tinggi)' }) {
  const g = useGeo();
  const a = { x: foot.x + u.x * size, y: foot.y + u.y * size };
  const c = { x: a.x + v.x * size, y: a.y + v.y * size };
  const b = { x: foot.x + v.x * size, y: foot.y + v.y * size };
  return <polyline points={g.pts([a, c, b])} fill="none" stroke={color} strokeWidth="2" />;
}

/** Pegangan yang bisa diseret (area sentuh 48px) dan digeser dengan tombol panah. */
export function Handle({ at, onDrag, onEnd, onNudge, label, color = '#154c7a' }) {
  const g = useGeo();
  const [active, setActive] = useState(false);
  const drag = useDrag({
    onStart: () => setActive(true),
    onMove: (w) => onDrag(w),
    onEnd: () => {
      setActive(false);
      onEnd?.();
    },
  });
  const cx = g.sx(at.x);
  const cy = g.sy(at.y);
  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={`${label}. Seret, atau gunakan tombol panah.`}
      className="cursor-grab outline-none active:cursor-grabbing"
      onKeyDown={(e) => {
        const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
        if (d && onNudge) {
          e.preventDefault();
          onNudge(d[0], d[1]);
        }
      }}
      {...drag}
    >
      <circle cx={cx} cy={cy} r={24} fill="transparent" />
      {!active && <circle cx={cx} cy={cy} r={16} fill={color} opacity="0.18" className="animate-pulse" />}
      <circle cx={cx} cy={cy} r={active ? 13 : 10} fill="white" stroke={color} strokeWidth={4} style={{ transition: 'r 120ms' }} />
      <circle cx={cx} cy={cy} r={3.5} fill={color} />
    </g>
  );
}
