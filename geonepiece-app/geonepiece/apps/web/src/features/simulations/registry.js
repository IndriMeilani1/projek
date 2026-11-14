import { lazy } from 'react';

// Daftar simulasi. Dimuat "lazy" agar bundel awal tetap kecil di HP.
export const SIMULATIONS = {
  'petak-satuan': {
    id: 'petak-satuan',
    title: 'Petak Satuan',
    desc: 'Luas = banyak petak. Dari menghitung ke p × l.',
    shape: 'persegi-panjang',
    Component: lazy(() => import('./sims/UnitGridSim.jsx')),
  },
  'jajar-genjang': {
    id: 'jajar-genjang',
    title: 'Potong & Geser Jajar Genjang',
    desc: 'Potong segitiga, geser, jadi persegi panjang.',
    shape: 'jajar-genjang',
    Component: lazy(() => import('./sims/ParallelogramSim.jsx')),
  },
  segitiga: {
    id: 'segitiga',
    title: 'Segitiga: Geser & Gandakan',
    desc: 'Puncak bergeser, luas tetap. Dua segitiga = jajar genjang.',
    shape: 'segitiga',
    Component: lazy(() => import('./sims/TriangleSim.jsx')),
  },
  trapesium: {
    id: 'trapesium',
    title: 'Trapesium Kembar',
    desc: 'Dua trapesium membentuk jajar genjang beralas a + b.',
    shape: 'trapesium',
    Component: lazy(() => import('./sims/TrapezoidSim.jsx')),
  },
  'layang-layang': {
    id: 'layang-layang',
    title: 'Layang-layang & Belah Ketupat',
    desc: 'Setengah dari persegi panjang d₁ × d₂.',
    shape: 'layang-layang',
    Component: lazy(() => import('./sims/KiteSim.jsx')),
  },
  gabungan: {
    id: 'gabungan',
    title: 'Bangun Gabungan',
    desc: 'Pecah atau kurangi — hasilnya sama.',
    shape: 'gabungan',
    Component: lazy(() => import('./sims/CompositeSim.jsx')),
  },
};
