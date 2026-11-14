// Ikon bangun datar kecil (viewBox 0 0 40 40) dengan kode warna konsisten.
const SHAPES = {
  persegi: 'M9 9h22v22H9z',
  'persegi-panjang': 'M4 12h32v16H4z',
  'jajar-genjang': 'M4 30 12 10h24l-8 20z',
  'belah-ketupat': 'M20 3 33 20 20 37 7 20z',
  'layang-layang': 'M20 3 32 14 20 37 8 14z',
  trapesium: 'M4 30 11 10h17l8 20z',
  segitiga: 'M4 32 26 32 14 8z',
  sembarang: 'M6 30 10 8l24 6-6 18z',
  gabungan: 'M4 34V8h12v12h20v14z',
  lingkaran: 'M20 4a16 16 0 1 0 0 32 16 16 0 0 0 0-32z',
};

export function ShapeIcon({ shape, size = 40, fill = '#fdeec0', stroke = '#154c7a', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d={SHAPES[shape] ?? SHAPES.sembarang} fill={fill} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export const SHAPE_NAMES = {
  persegi: 'Persegi',
  'persegi-panjang': 'Persegi panjang',
  'jajar-genjang': 'Jajar genjang',
  'belah-ketupat': 'Belah ketupat',
  'layang-layang': 'Layang-layang',
  trapesium: 'Trapesium',
  segitiga: 'Segitiga',
  sembarang: 'Segiempat sembarang',
};
