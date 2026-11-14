/*
 * Konten modul belajar GeOnePiece (M0–M6).
 * Setiap soal latihan: sentences (untuk Pembaca Soal) dengan tag: diketahui | ditanya | tidak.
 * misconceptions: jawaban salah yang sering muncul → pesan umpan balik.
 * CATATAN: soal latihan sengaja BERBEDA konteks & angkanya dari soal pretest–posttest.
 */

const S = (text, tag) => ({ text, tag });

export const MODULES = [
  {
    id: 'm0',
    no: 0,
    title: 'Konsep Luas & Satuan',
    island: 'Pulau Petak',
    shape: 'persegi',
    color: '#14b8a6',
    sim: 'petak-satuan',
    minutes: 12,
    pemantik: {
      text: 'Dua kamar sama-sama dipasangi karpet. Kamar Rina tertutup 12 petak karpet, kamar Budi tertutup 15 petak karpet yang ukurannya sama.',
      question: 'Kamar siapa yang lebih luas?',
      options: ['Kamar Rina', 'Kamar Budi', 'Tidak bisa ditentukan'],
      insight: 'Luas adalah banyaknya petak satuan yang menutupi suatu daerah. Karena ukuran petaknya sama, kamar dengan petak lebih banyak lebih luas. Ayo buktikan di simulasi!',
    },
    formula: null,
    keyIdea: ['Luas = banyak petak satuan yang menutupi daerah.', '1 m² = 10.000 cm²', 'Samakan satuan sebelum menghitung.'],
    example: {
      context: 'Lantai teras berukuran 2 m × 1,5 m. Berapa cm² luasnya?',
      steps: [
        { text: 'Samakan satuan ke cm.', calc: '2 m = 200 cm,  1,5 m = 150 cm' },
        { text: 'Hitung banyak petak 1 cm × 1 cm.', calc: '200 × 150 = 30.000' },
        { text: 'Cek dengan cara lain: luas dalam m² lalu dikali 10.000.', calc: '2 × 1,5 = 3 m² → 3 × 10.000 = 30.000 cm²' },
        { text: 'Jawaban dengan satuan yang benar.', calc: 'Luas teras = 30.000 cm²' },
      ],
      faded: { prompt: 'Sekarang kamu: ubah 0,5 m² menjadi cm².', answer: 5000, unit: 'cm²' },
    },
    practice: [
      {
        id: 'm0-1',
        sentences: [S('Sebuah ubin berbentuk persegi panjang.', 'tidak'), S('Ukurannya 30 cm × 20 cm.', 'diketahui'), S('Berapa cm² luas ubin itu?', 'ditanya')],
        answer: 600,
        unit: 'cm²',
        hints: ['Luas = banyak petak 1 cm × 1 cm.', 'Ada 20 baris, tiap baris 30 petak.', '30 × 20 = …'],
        misconceptions: [{ value: 100, msg: '100 adalah KELILING (jumlah panjang semua sisi). Luas menghitung petak di dalamnya.' }],
      },
      {
        id: 'm0-2',
        sentences: [S('Luas sebuah meja adalah 1,2 m².', 'diketahui'), S('Berapa cm² luas meja itu?', 'ditanya')],
        answer: 12000,
        unit: 'cm²',
        hints: ['1 m² = 10.000 cm².', 'Kalikan dengan 10.000.', '1,2 × 10.000 = …'],
        misconceptions: [{ value: 120, msg: '1 m² bukan 100 cm². Ingat: 1 m² = 100 cm × 100 cm = 10.000 cm².' }],
      },
      {
        id: 'm0-3',
        sentences: [S('Sebuah poster berukuran 60 cm × 50 cm.', 'diketahui'), S('Poster itu akan ditempel di mading.', 'tidak'), S('Berapa m² luas poster itu?', 'ditanya')],
        answer: 0.3,
        unit: 'm²',
        tol: 0.001,
        hints: ['Hitung dulu dalam cm².', '60 × 50 = 3.000 cm².', 'Bagi dengan 10.000 untuk mengubah ke m².'],
        misconceptions: [{ value: 30, msg: 'Untuk mengubah cm² ke m², bagi dengan 10.000 (bukan 100).' }],
      },
    ],
    explainPrompt: 'Jelaskan kepada temanmu: mengapa 1 m² sama dengan 10.000 cm², bukan 100 cm²?',
  },
  {
    id: 'm1',
    no: 1,
    title: 'Persegi & Persegi Panjang',
    island: 'Pulau Siku',
    shape: 'persegi-panjang',
    color: '#0ea5e9',
    sim: 'petak-satuan',
    minutes: 12,
    pemantik: {
      text: 'Sebuah persegi panjang berisi 4 baris petak, setiap baris berisi 6 petak.',
      question: 'Apakah kita harus menghitung petaknya satu per satu?',
      options: ['Ya, harus satu per satu', 'Tidak, bisa dengan perkalian', 'Tidak tahu'],
      insight: 'Karena setiap baris berisi jumlah petak yang sama, kita cukup mengalikan: banyak petak per baris × banyak baris.',
    },
    formula: {
      vars: { p: 'alas', l: 'tinggi' },
      tokens: ['p', 'l', '×', '+', '÷', '2'],
      check: (v) => v.p * v.l,
      needs: ['p', 'l'],
      result: 'L = p × l',
      note: 'Persegi adalah persegi panjang dengan p = l = s, jadi L = s × s.',
    },
    example: {
      context: 'Kebun Pak Joko berbentuk persegi panjang dengan panjang 8 m dan lebar 5 m. Berapa luasnya?',
      steps: [
        { text: 'Kenali bangunnya: persegi panjang.', calc: 'Rumus: L = p × l' },
        { text: 'Tuliskan yang diketahui.', calc: 'p = 8 m,  l = 5 m' },
        { text: 'Substitusi dan hitung.', calc: 'L = 8 × 5 = 40' },
        { text: 'Tulis satuan luas.', calc: 'Luas kebun = 40 m²' },
      ],
      faded: { prompt: 'Jika lebar kebun 7 m (panjang tetap 8 m), berapa m² luasnya?', answer: 56, unit: 'm²' },
    },
    practice: [
      {
        id: 'm1-1',
        sentences: [S('Pak Rudi membeli karpet berbentuk persegi panjang.', 'tidak'), S('Panjang karpet 3 m dan lebarnya 2 m.', 'diketahui'), S('Harga karpet itu Rp450.000.', 'tidak'), S('Berapa m² luas karpet itu?', 'ditanya')],
        answer: 6,
        unit: 'm²',
        hints: ['Bangunnya persegi panjang: L = p × l.', 'Harga karpet tidak diperlukan.', '3 × 2 = …'],
        misconceptions: [{ value: 10, msg: '10 adalah keliling (2 × (3 + 2)). Luas = p × l.' }, { value: 5, msg: 'Panjang dan lebar dikalikan, bukan dijumlahkan.' }],
      },
      {
        id: 'm1-2',
        sentences: [S('Sebuah taman berbentuk persegi.', 'diketahui'), S('Panjang sisinya 12 m.', 'diketahui'), S('Berapa m² luas taman itu?', 'ditanya')],
        answer: 144,
        unit: 'm²',
        hints: ['Persegi: semua sisi sama panjang.', 'L = s × s.', '12 × 12 = …'],
        misconceptions: [{ value: 48, msg: '48 adalah keliling (4 × 12). Luas = s × s.' }, { value: 24, msg: 'Luas persegi = s × s, bukan 2 × s.' }],
      },
      {
        id: 'm1-3',
        sentences: [S('Luas sebuah papan tulis yang berbentuk persegi panjang adalah 3,6 m².', 'diketahui'), S('Panjangnya 2,4 m.', 'diketahui'), S('Berapa meter lebar papan tulis itu?', 'ditanya')],
        answer: 1.5,
        unit: 'm',
        tol: 0.001,
        hints: ['L = p × l, berarti l = L ÷ p.', '3,6 ÷ 2,4 = …', 'Gunakan kalkulator bila perlu.'],
        misconceptions: [{ value: 8.64, msg: 'Yang dicari lebar, jadi luas DIBAGI panjang.' }],
      },
    ],
    explainPrompt: 'Jelaskan kepada temanmu mengapa luas persegi panjang = p × l dengan menggunakan petak satuan.',
  },
  {
    id: 'm2',
    no: 2,
    title: 'Jajar Genjang',
    island: 'Pulau Miring',
    shape: 'jajar-genjang',
    color: '#2563eb',
    sim: 'jajar-genjang',
    minutes: 18,
    pemantik: {
      text: 'Sebuah jajar genjang memiliki alas 6 cm, sisi miring 5 cm, dan tinggi 4 cm.',
      question: 'Menurutmu, luasnya 6 × 5 atau 6 × 4?',
      options: ['6 × 5 = 30 cm²', '6 × 4 = 24 cm²', 'Belum yakin'],
      insight: 'Mari kita potong jajar genjangnya dan susun ulang. Bangun apa yang terbentuk, dan ukuran mana yang menjadi lebarnya?',
    },
    formula: {
      vars: { a: 'alas', t: 'tinggi', m: 'sisi' },
      tokens: ['a', 't', 'm', '×', '÷', '2'],
      check: (v) => v.a * v.t,
      needs: ['a', 't'],
      forbid: ['m'],
      forbidMsg: 'Sisi miring (m) tidak dipakai! Setelah dipotong & digeser, lebar persegi panjangnya adalah TINGGI.',
      result: 'L = a × t',
      note: 'Tinggi selalu tegak lurus alas.',
    },
    example: {
      context: 'Sebuah ubin berbentuk jajar genjang dengan alas 10 cm, sisi miring 6 cm, dan tinggi 5 cm. Berapa luasnya?',
      steps: [
        { text: 'Kenali bangunnya: jajar genjang.', calc: 'Rumus: L = a × t' },
        { text: 'Pilih ukuran yang tepat. Tinggi = garis yang TEGAK LURUS alas.', calc: 'a = 10 cm,  t = 5 cm  (sisi miring 6 cm tidak dipakai)' },
        { text: 'Substitusi dan hitung.', calc: 'L = 10 × 5 = 50' },
        { text: 'Tulis satuan luas.', calc: 'Luas ubin = 50 cm²' },
      ],
      faded: { prompt: 'Jajar genjang dengan alas 12 cm, sisi miring 9 cm, dan tinggi 7 cm. Berapa cm² luasnya?', answer: 84, unit: 'cm²', wrong: [{ value: 108, msg: 'Itu memakai sisi miring. Gunakan tinggi.' }] },
    },
    practice: [
      {
        id: 'm2-1',
        sentences: [S('Bu Ani punya taplak meja berbentuk jajar genjang.', 'tidak'), S('Alasnya 50 cm, sisi miringnya 25 cm, dan tingginya 20 cm.', 'diketahui'), S('Taplak itu berwarna biru.', 'tidak'), S('Berapa cm² luas taplak itu?', 'ditanya')],
        answer: 1000,
        unit: 'cm²',
        hints: ['Bangunnya jajar genjang: L = a × t.', 'Tinggi = 20 cm (tegak lurus alas). Sisi miring tidak dipakai.', '50 × 20 = …'],
        misconceptions: [
          { value: 1250, msg: 'Kamu memakai sisi miring (25 cm). Tinggi harus tegak lurus alas — coba ketuk garis oranye di simulasi.' },
          { value: 500, msg: 'Jajar genjang tidak dibagi 2. Yang dibagi 2 adalah segitiga.' },
        ],
      },
      {
        id: 'm2-2',
        sentences: [S('Luas sebuah jajar genjang adalah 72 cm².', 'diketahui'), S('Alasnya 12 cm.', 'diketahui'), S('Berapa cm tingginya?', 'ditanya')],
        answer: 6,
        unit: 'cm',
        hints: ['L = a × t, jadi t = L ÷ a.', '72 ÷ 12 = …', 'Cek: 12 × 6 = 72.'],
        misconceptions: [{ value: 864, msg: 'Yang dicari tinggi, jadi luas DIBAGI alas.' }],
      },
      {
        id: 'm2-3',
        sentences: [
          S('Sebuah dinding seluas 1,2 m² akan ditutupi ubin berbentuk jajar genjang.', 'diketahui'),
          S('Setiap ubin memiliki alas 15 cm, tinggi 8 cm, dan sisi miring 10 cm.', 'diketahui'),
          S('Berapa banyak ubin yang dibutuhkan (anggap tanpa sisa)?', 'ditanya'),
        ],
        answer: 100,
        unit: 'ubin',
        hints: ['Samakan satuan: 1,2 m² = 12.000 cm².', 'Luas satu ubin = 15 × 8.', '12.000 ÷ 120 = …'],
        misconceptions: [{ value: 80, msg: 'Kamu memakai sisi miring (15 × 10). Luas ubin = alas × tinggi = 15 × 8.' }],
      },
    ],
    explainPrompt: 'Jelaskan kepada temanmu mengapa luas jajar genjang = alas × tinggi, bukan alas × sisi miring. Gunakan kata "potong" dan "geser".',
  },
  {
    id: 'm3',
    no: 3,
    title: 'Segitiga',
    island: 'Pulau Puncak',
    shape: 'segitiga',
    color: '#f59e0b',
    sim: 'segitiga',
    minutes: 15,
    pemantik: {
      text: 'Tiga segitiga memiliki alas yang sama (6 cm) dan tinggi yang sama (4 cm), tetapi bentuknya berbeda-beda: satu lancip, satu siku-siku, satu tumpul.',
      question: 'Segitiga mana yang paling luas?',
      options: ['Yang lancip', 'Yang siku-siku', 'Yang tumpul', 'Semuanya sama'],
      insight: 'Geser puncak segitiga di simulasi dan perhatikan angka luasnya!',
    },
    formula: {
      vars: { a: 'alas', t: 'tinggi' },
      tokens: ['a', 't', '×', '÷', '2', '½', '+'],
      check: (v) => (v.a * v.t) / 2,
      needs: ['a', 't'],
      result: 'L = ½ × a × t',
      note: 'Dua segitiga yang sama membentuk jajar genjang, jadi luas segitiga = setengahnya.',
    },
    example: {
      context: 'Sebuah bendera segitiga memiliki alas 12 cm dan tinggi 7 cm. Berapa luasnya?',
      steps: [
        { text: 'Kenali bangunnya: segitiga.', calc: 'Rumus: L = ½ × a × t' },
        { text: 'Tuliskan yang diketahui.', calc: 'a = 12 cm,  t = 7 cm' },
        { text: 'Substitusi dan hitung.', calc: 'L = ½ × 12 × 7 = 6 × 7 = 42' },
        { text: 'Tulis satuan luas.', calc: 'Luas bendera = 42 cm²' },
      ],
      faded: { prompt: 'Segitiga dengan alas 9 cm dan tinggi 8 cm. Berapa cm² luasnya?', answer: 36, unit: 'cm²', wrong: [{ value: 72, msg: 'Jangan lupa dikali ½.' }] },
    },
    practice: [
      {
        id: 'm3-1',
        sentences: [S('Rani membuat bendera segitiga untuk lomba.', 'tidak'), S('Alas bendera 40 cm dan tingginya 30 cm.', 'diketahui'), S('Bendera itu dijahit dengan benang merah.', 'tidak'), S('Berapa cm² kain yang diperlukan?', 'ditanya')],
        answer: 600,
        unit: 'cm²',
        hints: ['L = ½ × a × t.', '40 × 30 = 1.200.', 'Jangan lupa dibagi 2.'],
        misconceptions: [{ value: 1200, msg: 'Kamu lupa ½. Segitiga adalah setengah dari jajar genjang — lihat simulasi Gandakan & Putar.' }],
      },
      {
        id: 'm3-2',
        sentences: [S('Sebuah segitiga tumpul memiliki alas 9 cm.', 'diketahui'), S('Garis tingginya berada di luar segitiga dan panjangnya 6 cm.', 'diketahui'), S('Berapa cm² luas segitiga itu?', 'ditanya')],
        answer: 27,
        unit: 'cm²',
        hints: ['Tinggi boleh berada di luar segitiga — rumusnya tetap sama.', 'L = ½ × 9 × 6.', '54 ÷ 2 = …'],
        misconceptions: [{ value: 54, msg: 'Kamu lupa ½.' }],
      },
      {
        id: 'm3-3',
        sentences: [S('Luas sebuah segitiga 45 m².', 'diketahui'), S('Alasnya 10 m.', 'diketahui'), S('Berapa meter tingginya?', 'ditanya')],
        answer: 9,
        unit: 'm',
        hints: ['45 = ½ × 10 × t.', '45 = 5 × t.', 't = 45 ÷ 5.'],
        misconceptions: [{ value: 4.5, msg: 'Ingat ada ½: 45 = ½ × 10 × t = 5 × t.' }],
      },
    ],
    explainPrompt: 'Jelaskan kepada temanmu mengapa ada "½" pada rumus luas segitiga.',
  },
  {
    id: 'm4',
    no: 4,
    title: 'Trapesium',
    island: 'Pulau Kembar',
    shape: 'trapesium',
    color: '#6366f1',
    sim: 'trapesium',
    minutes: 15,
    pemantik: {
      text: 'Trapesium punya dua sisi sejajar yang panjangnya berbeda.',
      question: 'Jika dua trapesium yang sama ditempelkan (satu diputar), bangun apa yang terbentuk?',
      options: ['Persegi', 'Jajar genjang', 'Segitiga', 'Belum tahu'],
      insight: 'Ayo gandakan dan putar trapesium di simulasi!',
    },
    formula: {
      vars: { a: 'alas', b: 'alas', t: 'tinggi' },
      tokens: ['(', ')', 'a', 'b', 't', '+', '×', '÷', '2'],
      check: (v) => ((v.a + v.b) * v.t) / 2,
      needs: ['a', 'b', 't'],
      result: 'L = (a + b) × t ÷ 2',
      note: 'Dua trapesium membentuk jajar genjang beralas (a + b) dan tinggi t.',
    },
    example: {
      context: 'Sebuah papan nama berbentuk trapesium dengan sisi sejajar 8 cm dan 12 cm, serta tinggi 5 cm. Berapa luasnya?',
      steps: [
        { text: 'Kenali bangunnya: trapesium.', calc: 'Rumus: L = (a + b) × t ÷ 2' },
        { text: 'Jumlahkan kedua sisi sejajar.', calc: 'a + b = 8 + 12 = 20' },
        { text: 'Kalikan tinggi, lalu bagi 2.', calc: 'L = 20 × 5 ÷ 2 = 50' },
        { text: 'Tulis satuan luas.', calc: 'Luas papan = 50 cm²' },
      ],
      faded: { prompt: 'Trapesium dengan sisi sejajar 9 cm dan 5 cm, tinggi 4 cm. Berapa cm² luasnya?', answer: 28, unit: 'cm²', wrong: [{ value: 56, msg: 'Jangan lupa dibagi 2.' }] },
    },
    practice: [
      {
        id: 'm4-1',
        sentences: [S('Atap samping sebuah rumah berbentuk trapesium.', 'tidak'), S('Panjang sisi sejajarnya 6 m dan 4 m, sedangkan tingginya 3 m.', 'diketahui'), S('Atap itu dicat ulang setiap 5 tahun.', 'tidak'), S('Berapa m² luas atap itu?', 'ditanya')],
        answer: 15,
        unit: 'm²',
        hints: ['L = (a + b) × t ÷ 2.', 'a + b = 10.', '10 × 3 ÷ 2 = …'],
        misconceptions: [{ value: 30, msg: 'Kamu lupa dibagi 2. Ingat: dua trapesium membentuk satu jajar genjang.' }, { value: 72, msg: 'Kedua sisi sejajar dijumlahkan dulu, bukan dikalikan.' }],
      },
      {
        id: 'm4-2',
        sentences: [S('Sebuah trapesium memiliki sisi sejajar 14 cm dan 10 cm.', 'diketahui'), S('Tingginya 7 cm.', 'diketahui'), S('Berapa cm² luasnya?', 'ditanya')],
        answer: 84,
        unit: 'cm²',
        hints: ['a + b = 24.', '24 × 7 = 168.', '168 ÷ 2 = …'],
        misconceptions: [{ value: 168, msg: 'Kamu lupa dibagi 2.' }],
      },
      {
        id: 'm4-3',
        sentences: [S('Luas sebuah trapesium 60 cm².', 'diketahui'), S('Sisi sejajarnya 7 cm dan 13 cm.', 'diketahui'), S('Berapa cm tingginya?', 'ditanya')],
        answer: 6,
        unit: 'cm',
        hints: ['60 = (7 + 13) × t ÷ 2.', '60 = 20 × t ÷ 2 = 10 × t.', 't = 60 ÷ 10.'],
        misconceptions: [{ value: 3, msg: 'Ingat ÷ 2: 60 = 20 × t ÷ 2 = 10 × t.' }],
      },
    ],
    explainPrompt: 'Jelaskan kepada temanmu dari mana asal "a + b" dan "÷ 2" pada rumus trapesium.',
  },
  {
    id: 'm5',
    no: 5,
    title: 'Belah Ketupat & Layang-layang',
    island: 'Pulau Diagonal',
    shape: 'layang-layang',
    color: '#7c3aed',
    sim: 'layang-layang',
    minutes: 15,
    pemantik: {
      text: 'Sebuah layang-layang digambar di dalam persegi panjang yang ukurannya sama dengan kedua diagonalnya.',
      question: 'Berapa bagian persegi panjang yang ditempati layang-layang?',
      options: ['Seperempat', 'Setengah', 'Tiga perempat', 'Belum tahu'],
      insight: 'Masukkan potongan-potongan di luar layang-layang ke dalamnya di simulasi!',
    },
    formula: {
      vars: { 'd₁': 'diagonal', 'd₂': 'diagonal', s: 'sisi' },
      tokens: ['d₁', 'd₂', 's', '×', '÷', '2', '+'],
      check: (v) => (v['d₁'] * v['d₂']) / 2,
      needs: ['d₁', 'd₂'],
      forbid: ['s'],
      forbidMsg: 'Panjang sisi (s) tidak dipakai untuk luas belah ketupat & layang-layang. Gunakan kedua diagonalnya.',
      result: 'L = d₁ × d₂ ÷ 2',
      note: 'Berlaku untuk belah ketupat dan layang-layang.',
    },
    example: {
      context: 'Sebuah layang-layang memiliki diagonal 18 cm dan 10 cm. Berapa luasnya?',
      steps: [
        { text: 'Kenali bangunnya: layang-layang.', calc: 'Rumus: L = d₁ × d₂ ÷ 2' },
        { text: 'Tuliskan kedua diagonal.', calc: 'd₁ = 18 cm,  d₂ = 10 cm' },
        { text: 'Substitusi dan hitung.', calc: 'L = 18 × 10 ÷ 2 = 90' },
        { text: 'Tulis satuan luas.', calc: 'Luas = 90 cm²' },
      ],
      faded: { prompt: 'Belah ketupat dengan diagonal 14 cm dan 9 cm. Berapa cm² luasnya?', answer: 63, unit: 'cm²', wrong: [{ value: 126, msg: 'Jangan lupa dibagi 2.' }] },
    },
    practice: [
      {
        id: 'm5-1',
        sentences: [S('Dimas membuat layang-layang dari kertas.', 'tidak'), S('Panjang diagonalnya 30 cm dan 28 cm.', 'diketahui'), S('Panjang sisi-sisinya 17 cm dan 25 cm.', 'tidak'), S('Berapa cm² kertas yang dibutuhkan?', 'ditanya')],
        answer: 420,
        unit: 'cm²',
        hints: ['Yang dipakai adalah diagonal, bukan sisi.', '30 × 28 = 840.', '840 ÷ 2 = …'],
        misconceptions: [{ value: 840, msg: 'Kamu lupa dibagi 2.' }, { value: 425, msg: 'Luas layang-layang memakai diagonal, bukan panjang sisi.' }],
      },
      {
        id: 'm5-2',
        sentences: [S('Sebuah belah ketupat memiliki diagonal 16 cm dan 12 cm.', 'diketahui'), S('Berapa cm² luasnya?', 'ditanya')],
        answer: 96,
        unit: 'cm²',
        hints: ['L = d₁ × d₂ ÷ 2.', '16 × 12 = 192.', '192 ÷ 2 = …'],
        misconceptions: [{ value: 192, msg: 'Kamu lupa dibagi 2.' }],
      },
      {
        id: 'm5-3',
        sentences: [S('Luas sebuah belah ketupat 120 cm².', 'diketahui'), S('Salah satu diagonalnya 24 cm.', 'diketahui'), S('Berapa cm panjang diagonal lainnya?', 'ditanya')],
        answer: 10,
        unit: 'cm',
        hints: ['120 = 24 × d₂ ÷ 2.', '120 = 12 × d₂.', 'd₂ = 120 ÷ 12.'],
        misconceptions: [{ value: 5, msg: 'Ingat ÷ 2: 120 = 24 × d₂ ÷ 2 = 12 × d₂.' }],
      },
    ],
    explainPrompt: 'Jelaskan kepada temanmu mengapa luas layang-layang adalah setengah dari d₁ × d₂.',
  },
  {
    id: 'm6',
    no: 6,
    title: 'Bangun Gabungan',
    island: 'Pulau Teka-teki',
    shape: 'gabungan',
    color: '#e11d48',
    sim: 'gabungan',
    minutes: 15,
    pemantik: {
      text: 'Denah sebuah rumah berbentuk huruf L. Tidak ada rumus "luas huruf L".',
      question: 'Bagaimana cara menghitung luasnya?',
      options: ['Dipecah menjadi bangun yang dikenal', 'Dikurangi dari persegi panjang besar', 'Kedua cara bisa', 'Tidak bisa dihitung'],
      insight: 'Coba tiga strategi di simulasi dan bandingkan hasilnya!',
    },
    formula: null,
    keyIdea: ['Pecah: L = L₁ + L₂ + …', 'Kurangi: L = L besar − L yang kosong', 'Strategi berbeda → hasil sama.'],
    example: {
      context: 'Sebuah stiker terdiri atas persegi bersisi 8 cm dan segitiga di atasnya dengan alas 8 cm dan tinggi 5 cm. Berapa luas stiker?',
      steps: [
        { text: 'Pecah menjadi bangun yang dikenal.', calc: 'Stiker = persegi + segitiga' },
        { text: 'Hitung luas persegi.', calc: 'L₁ = 8 × 8 = 64 cm²' },
        { text: 'Hitung luas segitiga.', calc: 'L₂ = ½ × 8 × 5 = 20 cm²' },
        { text: 'Jumlahkan.', calc: 'L = 64 + 20 = 84 cm²' },
      ],
      faded: { prompt: 'Selembar karton 30 cm × 20 cm dilubangi berbentuk segitiga dengan alas 10 cm dan tinggi 6 cm. Berapa cm² sisa karton?', answer: 570, unit: 'cm²', wrong: [{ value: 540, msg: 'Luas lubang segitiga = ½ × 10 × 6 = 30, bukan 60.' }] },
    },
    practice: [
      {
        id: 'm6-1',
        sentences: [
          S('Lantai sebuah toko berbentuk huruf L.', 'tidak'),
          S('Bagian depan berukuran 10 m × 4 m.', 'diketahui'),
          S('Bagian belakang berukuran 5 m × 6 m.', 'diketahui'),
          S('Toko itu buka setiap hari pukul 08.00.', 'tidak'),
          S('Berapa m² luas lantai toko itu?', 'ditanya'),
        ],
        answer: 70,
        unit: 'm²',
        hints: ['Pecah menjadi dua persegi panjang.', '10 × 4 = 40 dan 5 × 6 = 30.', 'Jumlahkan kedua luas.'],
        misconceptions: [],
      },
      {
        id: 'm6-2',
        sentences: [S('Sebuah jendela terdiri atas persegi panjang 80 cm × 60 cm.', 'diketahui'), S('Di atasnya ada kaca segitiga dengan alas 80 cm dan tinggi 30 cm.', 'diketahui'), S('Berapa cm² luas seluruh kaca jendela?', 'ditanya')],
        answer: 6000,
        unit: 'cm²',
        hints: ['Persegi panjang: 80 × 60 = 4.800.', 'Segitiga: ½ × 80 × 30 = 1.200.', '4.800 + 1.200 = …'],
        misconceptions: [{ value: 7200, msg: 'Luas segitiga = ½ × a × t. Kamu lupa ½.' }],
      },
      {
        id: 'm6-3',
        sentences: [S('Halaman rumah berbentuk persegi panjang 12 m × 9 m.', 'diketahui'), S('Di sudut halaman ada gudang berbentuk persegi bersisi 3 m.', 'diketahui'), S('Selain gudang, halaman ditanami rumput.', 'diketahui'), S('Berapa m² luas bagian yang ditanami rumput?', 'ditanya')],
        answer: 99,
        unit: 'm²',
        hints: ['Strategi kurangi: luas halaman − luas gudang.', '12 × 9 = 108 dan 3 × 3 = 9.', '108 − 9 = …'],
        misconceptions: [{ value: 117, msg: 'Gudang tidak ditanami rumput, jadi luasnya DIKURANGI.' }, { value: 108, msg: 'Jangan lupa mengurangi luas gudang.' }],
      },
    ],
    explainPrompt: 'Jelaskan kepada temanmu dua cara berbeda untuk menghitung luas bangun berbentuk huruf L.',
  },
];

export const getModule = (id) => MODULES.find((m) => m.id === id);

// ---------- Generator "Soal mirip" (angka acak yang hasilnya tetap wajar) ----------
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const TRIPLES = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
];

export const GENERATORS = {
  m1: () => {
    const p = rnd(4, 15);
    const l = rnd(2, 9);
    return {
      id: `gen-m1-${p}-${l}`,
      sentences: [S(`Sebuah kolam renang anak berbentuk persegi panjang berukuran ${p} m × ${l} m.`, 'diketahui'), S('Berapa m² luas kolam itu?', 'ditanya')],
      answer: p * l,
      unit: 'm²',
      hints: ['L = p × l.', `${p} × ${l} = …`],
      misconceptions: [{ value: 2 * (p + l), msg: 'Itu keliling. Luas = p × l.' }],
    };
  },
  m2: () => {
    const [o, t, m] = pick(TRIPLES);
    const a = rnd(Math.max(o + 2, 6), 20);
    return {
      id: `gen-m2-${a}-${t}`,
      sentences: [S('Sebidang tanah berbentuk jajar genjang.', 'tidak'), S(`Alasnya ${a} m, sisi miringnya ${m} m, dan tingginya ${t} m.`, 'diketahui'), S('Berapa m² luas tanah itu?', 'ditanya')],
      answer: a * t,
      unit: 'm²',
      hints: ['L = a × t (tinggi, bukan sisi miring).', `${a} × ${t} = …`],
      misconceptions: [
        { value: a * m, msg: 'Kamu memakai sisi miring. Tinggi harus tegak lurus alas.' },
        { value: (a * t) / 2, msg: 'Jajar genjang tidak dibagi 2.' },
      ],
    };
  },
  m3: () => {
    const a = rnd(3, 12) * 2;
    const t = rnd(3, 15);
    return {
      id: `gen-m3-${a}-${t}`,
      sentences: [S(`Sebuah papan petunjuk berbentuk segitiga dengan alas ${a} cm dan tinggi ${t} cm.`, 'diketahui'), S('Berapa cm² luas papan itu?', 'ditanya')],
      answer: (a * t) / 2,
      unit: 'cm²',
      hints: ['L = ½ × a × t.', `½ × ${a} × ${t} = …`],
      misconceptions: [{ value: a * t, msg: 'Kamu lupa ½.' }],
    };
  },
  m4: () => {
    const a = rnd(6, 16);
    const b = rnd(2, a - 1);
    const t = rnd(1, 6) * 2;
    return {
      id: `gen-m4-${a}-${b}-${t}`,
      sentences: [S(`Sebuah meja berbentuk trapesium memiliki sisi sejajar ${a} dm dan ${b} dm, dengan tinggi ${t} dm.`, 'diketahui'), S('Berapa dm² luas permukaan meja itu?', 'ditanya')],
      answer: ((a + b) * t) / 2,
      unit: 'dm²',
      hints: ['L = (a + b) × t ÷ 2.', `(${a} + ${b}) × ${t} ÷ 2 = …`],
      misconceptions: [{ value: (a + b) * t, msg: 'Kamu lupa dibagi 2.' }],
    };
  },
  m5: () => {
    const d1 = rnd(3, 12) * 2;
    const d2 = rnd(4, 20);
    return {
      id: `gen-m5-${d1}-${d2}`,
      sentences: [S(`Sebuah hiasan berbentuk belah ketupat memiliki diagonal ${d1} cm dan ${d2} cm.`, 'diketahui'), S('Berapa cm² luasnya?', 'ditanya')],
      answer: (d1 * d2) / 2,
      unit: 'cm²',
      hints: ['L = d₁ × d₂ ÷ 2.', `${d1} × ${d2} ÷ 2 = …`],
      misconceptions: [{ value: d1 * d2, msg: 'Kamu lupa dibagi 2.' }],
    };
  },
};
GENERATORS.m0 = GENERATORS.m1;
GENERATORS.m6 = () => {
  const p = rnd(8, 14);
  const l = rnd(5, 9);
  const s = rnd(2, 4);
  return {
    id: `gen-m6-${p}-${l}-${s}`,
    sentences: [S(`Sebuah lapangan berukuran ${p} m × ${l} m.`, 'diketahui'), S(`Di dalamnya ada bak pasir berbentuk persegi bersisi ${s} m.`, 'diketahui'), S('Berapa m² luas lapangan selain bak pasir?', 'ditanya')],
    answer: p * l - s * s,
    unit: 'm²',
    hints: ['Strategi kurangi.', `${p} × ${l} − ${s} × ${s} = …`],
    misconceptions: [{ value: p * l + s * s, msg: 'Bak pasir dikurangi, bukan ditambah.' }],
  };
};
