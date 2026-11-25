/*
 * Kunci jawaban & pedoman penskoran per tahapan (sumber: kisi-kisi peneliti,
 * docs/INSTRUMEN_PRETEST_POSTTEST.md §5–6).
 * Hanya dimuat oleh halaman Mode Guru (lazy chunk).
 * PERHATIAN: dalam mode mandiri (tanpa API), file ini tetap ikut terunduh ke perangkat.
 * Untuk penelitian, gunakan perangkat guru tersendiri atau mode API.
 *
 * Setiap soal: daftar tahap { A, B, points } — A = teks tahap Paket A (pretest), B = Paket B (posttest).
 * Jumlah poin per soal = 6 (lihat MAX_PER_ITEM di tests.js).
 */

/** Pedoman umum penskoran (kisi-kisi bagian D). */
export const SCORING_GUIDE = [
  'Skor penuh diberikan apabila siswa menunjukkan tahapan penyelesaian yang benar dan menggunakan rumus luas bangun datar secara tepat.',
  'Skor parsial tetap diberikan apabila siswa sudah menunjukkan tahapan berpikir yang benar, tetapi melakukan kesalahan perhitungan pada tahap berikutnya.',
  'Jawaban akhir yang benar tanpa langkah penyelesaian perlu dinilai berdasarkan tahapan yang benar-benar ditunjukkan siswa.',
  'Kesalahan dalam memilih rumus, memasukkan angka, dan melakukan operasi hitung dicatat sebagai bahan analisis kesulitan siswa.',
];

const stage = (points, A, B) => ({ points, A, B });

export const KEYS = {
  1: {
    answer: {
      A: 'L = 8 × 6 = 48 m². Karpet B (48 m²) dipilih karena luasnya sama dengan luas lantai; Karpet A (40 m²) tidak cukup.',
      B: 'L = 9 × 5 = 45 m². Kain B (45 m²) dipilih karena luasnya sama dengan luas permukaan meja; Kain A (40 m²) tidak cukup.',
    },
    stages: [
      stage(1, 'Mengidentifikasi informasi: lantai berbentuk persegi panjang, panjang 8 m dan lebar 6 m.', 'Mengidentifikasi informasi: meja berbentuk persegi panjang, panjang 9 m dan lebar 5 m.'),
      stage(2, 'Menentukan rumus luas persegi panjang: L = p × l.', 'Menentukan rumus luas persegi panjang: L = p × l.'),
      stage(1, 'Menghitung luas lantai: 8 × 6 = 48 m².', 'Menghitung luas meja: 9 × 5 = 45 m².'),
      stage(1, 'Membandingkan luas lantai dengan kedua karpet: Karpet A = 40 m², Karpet B = 48 m².', 'Membandingkan luas meja dengan kedua kain: Kain A = 40 m², Kain B = 45 m².'),
      stage(1, 'Menentukan Karpet B lebih tepat dipilih karena luasnya sama dengan luas lantai.', 'Menentukan Kain B lebih tepat dipilih karena luasnya sama dengan luas permukaan meja.'),
    ],
  },
  2: {
    answer: {
      A: 'Persegi, L = s × s = 9 × 9 = 81 m². Luas kebun sekolah 81 m².',
      B: 'Persegi, L = s × s = 11 × 11 = 121 m². Luas halaman rumah 121 m².',
    },
    stages: [
      stage(1, 'Mengidentifikasi informasi yang diketahui: panjang sisi kebun 9 m.', 'Mengidentifikasi informasi yang diketahui: panjang sisi halaman 11 m.'),
      stage(1, 'Menentukan bahwa bangun tersebut berbentuk persegi.', 'Menentukan bahwa bangun tersebut berbentuk persegi.'),
      stage(1, 'Menentukan model matematika: L = s × s.', 'Menentukan model matematika: L = s × s.'),
      stage(1, 'Memasukkan ukuran sisi ke dalam rumus: L = 9 × 9.', 'Memasukkan ukuran sisi ke dalam rumus: L = 11 × 11.'),
      stage(1, 'Menghitung hasilnya: L = 81 m².', 'Menghitung hasilnya: L = 121 m².'),
      stage(1, 'Menyimpulkan bahwa luas kebun sekolah adalah 81 m².', 'Menyimpulkan bahwa luas halaman rumah adalah 121 m².'),
    ],
  },
  3: {
    answer: {
      A: 'L = ½ × a × t = ½ × 12 × 8 = 48 cm². Luas hiasan dinding 48 cm².',
      B: 'L = ½ × a × t = ½ × 14 × 10 = 70 cm². Luas bendera hias 70 cm².',
    },
    stages: [
      stage(1, 'Mengidentifikasi informasi: alas 12 cm dan tinggi 8 cm.', 'Mengidentifikasi informasi: alas 14 cm dan tinggi 10 cm.'),
      stage(2, 'Memilih rumus luas segitiga: L = ½ × a × t.', 'Memilih rumus luas segitiga: L = ½ × a × t.'),
      stage(2, 'Melakukan perhitungan: L = ½ × 12 × 8 = 48 cm².', 'Melakukan perhitungan: L = ½ × 14 × 10 = 70 cm².'),
      stage(1, 'Menyimpulkan bahwa luas hiasan dinding adalah 48 cm².', 'Menyimpulkan bahwa luas bendera hias adalah 70 cm².'),
    ],
  },
  4: {
    answer: {
      A: 'L = 10 × 7 = 70 m², sama dengan hasil siswa → perhitungan siswa BENAR. Luas ruang kelas 70 m².',
      B: 'L = 12 × 6 = 72 m², sama dengan hasil siswa → perhitungan siswa BENAR. Luas teras rumah 72 m².',
    },
    stages: [
      stage(1, 'Mengidentifikasi informasi: panjang 10 m dan lebar 7 m.', 'Mengidentifikasi informasi: panjang 12 m dan lebar 6 m.'),
      stage(1, 'Menentukan rumus luas persegi panjang: L = p × l.', 'Menentukan rumus luas persegi panjang: L = p × l.'),
      stage(1, 'Menghitung luas ruang kelas: L = 10 × 7 = 70 m².', 'Menghitung luas teras: L = 12 × 6 = 72 m².'),
      stage(1, 'Membandingkan hasil perhitungan dengan jawaban siswa (sama-sama 70 m²).', 'Membandingkan hasil perhitungan dengan jawaban siswa (sama-sama 72 m²).'),
      stage(1, 'Menilai bahwa hasil perhitungan tersebut benar.', 'Menilai bahwa hasil perhitungan tersebut benar.'),
      stage(1, 'Menyimpulkan bahwa luas ruang kelas adalah 70 m².', 'Menyimpulkan bahwa luas teras rumah adalah 72 m².'),
    ],
  },
};
