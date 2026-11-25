/*
 * Instrumen pretest–posttest literasi matematika
 * (sumber: kisi-kisi peneliti, lihat docs/INSTRUMEN_PRETEST_POSTTEST.md).
 * Paket A = pretest, Paket B = posttest (paralel). JANGAN mengubah butir tanpa memperbarui kunci (keys.js) & dokumen.
 * Satu soal = satu indikator literasi (PISA 2022):
 *   R = Mathematical Reasoning · F = Formulating · E = Employing · I = Interpreting & Evaluating
 * Penskoran per tahap penyelesaian: 6 poin per soal → skor mentah maks 24 → nilai maks 100.
 */

export const PROCESS = {
  R: 'Penalaran Matematis',
  F: 'Merumuskan',
  E: 'Menerapkan',
  I: 'Menafsirkan & Mengevaluasi',
};

export const ITEM_PROCESS = { 1: 'R', 2: 'F', 3: 'E', 4: 'I' };
export const ITEM_ORDER = Object.keys(ITEM_PROCESS); // ['1', '2', '3', '4']
export const MAX_PER_ITEM = 6;
export const MAX_SCORE = ITEM_ORDER.length * MAX_PER_ITEM; // 24 (skor mentah)
export const MAX_NILAI = 100; // nilai = skor ÷ 24 × 100

const essay = (no, prompt) => ({ no, type: 'essay', prompt });

export const PACKAGES = {
  A: {
    id: 'A',
    kind: 'pre',
    title: 'Pretest (Paket A)',
    units: [
      {
        id: 'A1',
        title: 'Karpet Ruang Belajar',
        context: 'Personal',
        sentences: [
          'Sebuah ruang belajar memiliki lantai berbentuk persegi panjang dengan panjang 8 meter dan lebar 6 meter.',
          'Tersedia dua karpet dengan ukuran sebagai berikut:',
          'Karpet A memiliki luas 40 m².',
          'Karpet B memiliki luas 48 m².',
        ],
        items: [essay('1', 'Jika karpet harus menutupi seluruh lantai ruang belajar, karpet manakah yang sebaiknya dipilih? Jelaskan alasan matematis Anda!')],
      },
      {
        id: 'A2',
        title: 'Kebun Sekolah',
        context: 'Sosial',
        sentences: [
          'Sebuah kebun sekolah berbentuk persegi memiliki panjang sisi 9 meter.',
          'Sekolah ingin mengetahui luas seluruh kebun untuk menentukan kebutuhan lahan penghijauan.',
        ],
        items: [essay('2', 'Tentukan luas kebun tersebut dengan menggunakan model matematika yang sesuai!')],
      },
      {
        id: 'A3',
        title: 'Hiasan Dinding',
        context: 'Personal',
        sentences: ['Sebuah hiasan dinding berbentuk segitiga memiliki panjang alas 12 cm dan tinggi 8 cm.'],
        items: [essay('3', 'Berapakah luas hiasan dinding tersebut? Tunjukkan langkah perhitungan Anda!')],
      },
      {
        id: 'A4',
        title: 'Ruang Kelas',
        context: 'Sosial',
        sentences: [
          'Sebuah ruang kelas berbentuk persegi panjang memiliki panjang 10 meter dan lebar 7 meter.',
          'Seorang siswa menghitung luas ruang kelas tersebut dan memperoleh hasil 70 m².',
        ],
        items: [essay('4', 'Apakah hasil perhitungan siswa tersebut benar? Jelaskan alasan Anda!')],
      },
    ],
  },
  B: {
    id: 'B',
    kind: 'post',
    title: 'Posttest (Paket B)',
    units: [
      {
        id: 'B1',
        title: 'Kain Penutup Meja',
        context: 'Personal',
        sentences: [
          'Sebuah meja berbentuk persegi panjang memiliki panjang 9 meter dan lebar 5 meter.',
          'Tersedia dua kain penutup meja dengan ukuran sebagai berikut:',
          'Kain A memiliki luas 40 m².',
          'Kain B memiliki luas 45 m².',
        ],
        items: [essay('1', 'Jika kain harus menutupi seluruh permukaan meja, kain manakah yang sebaiknya dipilih? Jelaskan alasan matematis Anda!')],
      },
      {
        id: 'B2',
        title: 'Halaman Rumah',
        context: 'Personal',
        sentences: [
          'Sebuah halaman rumah berbentuk persegi memiliki panjang sisi 11 meter.',
          'Pemilik rumah ingin mengetahui luas seluruh halaman tersebut sebelum memasang paving.',
        ],
        items: [essay('2', 'Tentukan luas halaman rumah dengan menggunakan model matematika yang sesuai!')],
      },
      {
        id: 'B3',
        title: 'Bendera Hias',
        context: 'Personal',
        sentences: ['Sebuah bendera hias berbentuk segitiga memiliki panjang alas 14 cm dan tinggi 10 cm.'],
        items: [essay('3', 'Berapakah luas bendera hias tersebut? Tunjukkan langkah perhitungan Anda!')],
      },
      {
        id: 'B4',
        title: 'Teras Rumah',
        context: 'Personal',
        sentences: [
          'Sebuah teras rumah berbentuk persegi panjang memiliki panjang 12 meter dan lebar 6 meter.',
          'Seorang siswa menghitung luas teras tersebut dan memperoleh hasil 72 m².',
        ],
        items: [essay('4', 'Apakah hasil perhitungan siswa tersebut benar? Jelaskan alasan Anda!')],
      },
    ],
  },
};

export const packageForKind = (kind) => (kind === 'post' ? PACKAGES.B : PACKAGES.A);
export const allItems = (pkg) => pkg.units.flatMap((u) => u.items.map((it) => ({ ...it, unit: u })));

export const TEST_RULES = {
  durationMin: 80,
  calculator: true,
  instructions: [
    'Berdoalah sebelum mengerjakan.',
    'Bacalah setiap cerita dengan teliti. Kamu boleh menyorot informasi penting dengan alat Pembaca Soal.',
    'Tuliskan CARA dan ALASANMU, bukan hanya jawaban akhir. Kamu boleh menggambar.',
    'Kamu boleh memakai kalkulator.',
    'Jawaban tersimpan otomatis di HP-mu, walaupun tidak ada internet.',
    'Waktu mengerjakan 80 menit.',
  ],
};
