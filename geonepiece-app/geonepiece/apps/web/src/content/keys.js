/*
 * Kunci jawaban & rubrik (sumber: docs/INSTRUMEN_PRETEST_POSTTEST.md §6).
 * Hanya dimuat oleh halaman Mode Guru (lazy chunk).
 * PERHATIAN: dalam mode mandiri (tanpa API), file ini tetap ikut terunduh ke perangkat.
 * Untuk penelitian, gunakan perangkat guru tersendiri atau mode API.
 */

export const GENERAL_RUBRIC = {
  R: {
    4: 'Kesimpulan benar dengan argumen matematis lengkap dan runtut',
    3: 'Kesimpulan benar, argumen benar tetapi kurang lengkap',
    2: 'Kesimpulan benar tanpa alasan, atau alasan sebagian benar',
    1: 'Kesimpulan salah, tetapi ada langkah/alasan yang relevan',
    0: 'Tidak menjawab / tidak relevan',
  },
  F: {
    4: 'Model/strategi tepat dan lengkap; informasi relevan dipilih dengan benar',
    3: 'Model tepat dengan kekurangan kecil',
    2: 'Sebagian model benar',
    1: 'Ada upaya mengidentifikasi informasi, model belum tepat',
    0: 'Tidak menjawab / tidak relevan',
  },
  E: {
    4: 'Prosedur, perhitungan, dan satuan benar',
    3: 'Prosedur benar, ada kesalahan hitung/satuan kecil',
    2: 'Strategi benar, tetapi perhitungan berhenti/banyak salah',
    1: 'Ada upaya prosedur yang relevan',
    0: 'Tidak menjawab / tidak relevan',
  },
  I: {
    4: 'Hasil ditafsirkan dalam konteks dan klaim dievaluasi dengan alasan yang kuat',
    3: 'Penafsiran benar, alasan kurang lengkap',
    2: 'Menyadari ada masalah tetapi tidak menjelaskannya',
    1: 'Ada upaya menafsirkan tanpa dasar yang benar',
    0: 'Tidak menjawab / tidak relevan',
  },
};

export const KEYS = {
  '1.1': {
    A: '400 cm × 300 cm = 120.000 cm²; satu keramik 1.600 cm²; 120.000 ÷ 1.600 = 75 keramik (atau 10 × 7,5 = 75).',
    B: '330 cm × 240 cm = 79.200 cm²; satu keramik 3.600 cm²; 79.200 ÷ 3.600 = 22 keramik (atau 5,5 × 4 = 22).',
    notes: 'Skor 3 bila menjawab 80 (A) / 24 (B) dengan cara pembulatan per baris yang dijelaskan. Skor 2 bila lupa menyamakan satuan tetapi strategi benar.',
  },
  '1.2': {
    A: '7 baris utuh (70 keramik) + 1 baris setengah (10 potongan 40 × 20). Satu keramik dipotong dua → dua potongan terpakai → 5 keramik. 75 cukup bila potongan dimanfaatkan. Tukang menghitung 80 karena sisa potongan dianggap terbuang/cadangan.',
    B: '4 baris × 5 keramik utuh (20) + 4 potongan setengah (60 × 30) = 2 keramik → 22 cukup bila potongan dimanfaatkan. Tukang menghitung 24 karena sisa/cadangan.',
    notes: 'Skor 4: menjelaskan pemanfaatan potongan DAN alasan tukang. Skor 3: salah satu pendapat dijelaskan benar. Skor 2: hanya pendapat tanpa alasan pemasangan. "Beli lebih untuk cadangan" diterima.',
  },
  '2.1': {
    A: 'Salah. L = alas × tinggi = 24 × 12 = 288 m²; 13 m adalah sisi miring. Alasan potong–geser: segitiga dipindah → persegi panjang 24 × 12.',
    B: 'Salah. L = 20 × 8 = 160 m²; 10 m adalah sisi miring. Alasan potong–geser.',
    notes: 'Skor 4: "salah" + luas benar + alasan konseptual (tinggi ⟂ alas / potong–geser). Skor 3: tanpa alasan konseptual. Skor 2: "salah" tanpa alasan atau luas salah.',
  },
  '2.2': {
    A: '288 ÷ 16 = 18 kg; 18 × Rp12.000 = Rp216.000.',
    B: '160 ÷ 10 = 16 bungkus; 16 × Rp15.000 = Rp240.000.',
    notes: 'Bila memakai luas salah dari 2.1 (312 / 200) tetapi prosedur benar → skor 3 (tidak dihukum dua kali).',
  },
  '3.1': {
    A: 'Diperlukan kedua diagonal (30 cm dan 44 cm); sisi 17 & 39 cm tidak diperlukan. L = 30 × 44 ÷ 2 = 660 cm².',
    B: 'Diagonal 24 cm dan 25 cm; sisi 15 & 20 cm tidak diperlukan. L = 24 × 25 ÷ 2 = 300 cm².',
    notes: 'Skor 4: memilih diagonal + luas benar. Skor 3: luas benar tanpa menyebut ukuran yang tidak diperlukan. Skor 2: lupa ÷ 2. Skor 1: memakai sisi.',
  },
  '3.2': {
    A: 'Tidak cukup secara praktis. 1,83 lembar adalah batas minimum; bentuk layang-layang tidak menutup kertas tanpa sisa. Tiap layang-layang dari persegi panjang 30 × 44 → 4 per lembar → 15 ÷ 4 = 3,75 → 4 lembar.',
    B: 'Tidak cukup. Tiap hiasan butuh persegi panjang 24 × 25; satu lembar 50 × 60 memuat 4 hiasan → 20 ÷ 4 = 5 lembar.',
    notes: 'Jawaban lain diterima bila disertai susunan potong yang masuk akal. Skor 3: menolak klaim + alasan sisa, tanpa jumlah. Skor 2: hanya membulatkan. Skor 1: menerima klaim.',
  },
  '4.1': {
    A: 'Luas rumput = luas trapesium − luas kolam = [(10 + 16) ÷ 2 × 8] − (3 × 3).',
    B: 'Luas paving = luas trapesium − luas pos = [(12 + 18) ÷ 2 × 10] − (4 × 2,5).',
    notes: 'Skor 4: strategi selisih dengan rumus tepat. Skor 3: satu rumus kurang tepat. Skor 2: tidak mengurangi. Strategi memecah (persegi panjang + segitiga) diterima.',
  },
  '4.2': {
    A: '104 − 9 = 95 m²; 95 × Rp25.000 = Rp2.375.000 ≤ Rp2.500.000 → cukup, sisa Rp125.000.',
    B: '150 − 10 = 140 m²; 140 × Rp85.000 = Rp11.900.000 ≤ Rp12.000.000 → cukup, sisa Rp100.000.',
    notes: 'Tanpa keputusan "cukup" → maksimal 3. Lupa mengurangi kolam/pos (A: Rp2.600.000; B: Rp12.750.000 → "tidak cukup") → skor 2.',
  },
  '5.1': {
    A: 'D. Alas sama (6) dan tinggi sama (4) → masing-masing ½ × 6 × 4 = 12 satuan². Tinggi R di luar segitiga tetapi tetap 4.',
    B: 'D. Alas 8, tinggi 3 → masing-masing 12 satuan². Tinggi M di luar segitiga.',
    notes: 'Skor 4: D + alasan alas & tinggi sama. Skor 3: D + menghitung sebagian. Skor 2: D tanpa alasan. Skor 1: pilihan salah tetapi minimal satu luas benar.',
    choice: 'D',
  },
  '5.2': {
    A: 'Budi. Luas lama 600 cm². Cara Budi: ½ × 60 × 40 = 1.200 (2 kali). Cara Andi: ½ × 60 × 80 = 2.400 (4 kali).',
    B: 'Eko. Luas lama 500 cm². Cara Eko: ½ × 50 × 10 = 250 (setengah). Cara Dewi: ½ × 25 × 10 = 125 (seperempat).',
    notes: 'Skor 4: memilih benar + menghitung kedua cara + kelipatannya (atau alasan umum: dua-duanya ×2 → ×4). Skor 2: memilih benar tanpa perhitungan. "Keduanya benar" → skor 1.',
  },
};
