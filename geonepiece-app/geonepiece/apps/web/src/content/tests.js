/*
 * Instrumen pretest–posttest literasi matematika (sumber: docs/INSTRUMEN_PRETEST_POSTTEST.md).
 * Paket A = pretest, Paket B = posttest (isomorfik). JANGAN mengubah butir tanpa memperbarui kunci & dokumen.
 * Proses PISA 2022: R = penalaran, F = merumuskan, E = menerapkan, I = menafsirkan & mengevaluasi.
 */

const fig = (name) => `${import.meta.env?.BASE_URL ?? './'}figures/${name}`;

export const PROCESS = {
  R: 'Penalaran',
  F: 'Merumuskan',
  E: 'Menerapkan',
  I: 'Menafsirkan & Mengevaluasi',
};

export const ITEM_PROCESS = { '1.1': 'E', '1.2': 'I', '2.1': 'R', '2.2': 'E', '3.1': 'F', '3.2': 'I', '4.1': 'F', '4.2': 'E', '5.1': 'R', '5.2': 'R' };
export const ITEM_ORDER = Object.keys(ITEM_PROCESS);
export const MAX_PER_ITEM = 4;
export const MAX_SCORE = ITEM_ORDER.length * MAX_PER_ITEM; // 40

const essay = (no, prompt) => ({ no, type: 'essay', prompt });

export const PACKAGES = {
  A: {
    id: 'A',
    kind: 'pre',
    title: 'Pretest (Paket A)',
    units: [
      {
        id: 'A1',
        title: 'Keramik Kamar Dina',
        context: 'Personal',
        sentences: ['Kamar Dina berbentuk persegi panjang dengan ukuran 4 m × 3 m.', 'Lantai kamar akan dipasangi keramik berbentuk persegi berukuran 40 cm × 40 cm.'],
        items: [
          essay('1.1', 'Berapa banyak keramik paling sedikit yang dibutuhkan agar seluruh lantai kamar tertutup? Tuliskan caramu.'),
          essay(
            '1.2',
            'Tukang keramik berkata, "Harus beli 80 keramik, karena 300 cm tidak habis dibagi 40 cm." Dina menjawab, "Menurut hitunganku, 75 keramik sudah cukup." Menurutmu, bagaimana pendapat Dina dan pendapat tukang? Jelaskan dengan memperhatikan cara keramik dipasang di lantai.',
          ),
        ],
      },
      {
        id: 'A2',
        title: 'Lahan Pak Darto',
        context: 'Pekerjaan',
        sentences: ['Pak Darto memiliki lahan berbentuk jajar genjang seperti gambar berikut.'],
        figure: fig('A2_lahan_jajar_genjang.svg'),
        figureAlt: 'Jajar genjang dengan alas 24 m, sisi miring 13 m, dan tinggi 12 m.',
        items: [
          essay('2.1', 'Pak Darto menghitung luas lahannya: 24 × 13 = 312 m². Apakah perhitungan Pak Darto benar? Jelaskan alasanmu. (Kamu boleh menggambar untuk menjelaskan.)'),
          essay('2.2', 'Setiap 16 m² lahan membutuhkan 1 kg pupuk. Harga pupuk Rp12.000 per kg. Berapa biaya paling sedikit yang harus dikeluarkan Pak Darto untuk memupuk seluruh lahannya? Tuliskan caramu.'),
        ],
      },
      {
        id: 'A3',
        title: 'Layang-layang Festival',
        context: 'Personal',
        sentences: [
          'Kelas 7B membuat layang-layang untuk festival.',
          'Rangka satu layang-layang berukuran seperti gambar berikut.',
          'Kertas minyak ditempel tepat menutupi bagian dalam rangka.',
        ],
        figure: fig('A3_layang_layang.svg'),
        figureAlt: 'Layang-layang dengan diagonal 30 cm dan 44 cm (terbagi 8 cm dan 36 cm), sisi 17 cm dan 39 cm.',
        items: [
          essay('3.1', 'Tidak semua ukuran pada gambar diperlukan untuk menghitung luas kertas satu layang-layang. Ukuran mana yang kamu perlukan? Berapa luas kertas minyak untuk satu layang-layang?'),
          essay(
            '3.2',
            'Kelas 7B akan membuat 15 layang-layang. Kertas minyak dijual per lembar berukuran 60 cm × 90 cm. Rina menghitung: "15 × 660 = 9.900 cm². Satu lembar = 60 × 90 = 5.400 cm². 9.900 : 5.400 ≈ 1,83. Jadi cukup membeli 2 lembar." Apakah 2 lembar benar-benar cukup? Berikan alasanmu dan tentukan banyak lembar yang menurutmu perlu dibeli.',
          ),
        ],
      },
      {
        id: 'A4',
        title: 'Taman Sekolah',
        context: 'Sosial',
        sentences: ['Sekolah memiliki taman berbentuk trapesium.', 'Di dalam taman terdapat kolam berbentuk persegi.', 'Seluruh bagian taman, kecuali kolam, akan ditanami rumput.'],
        figure: fig('A4_taman_trapesium.svg'),
        figureAlt: 'Trapesium siku-siku dengan sisi sejajar 10 m dan 16 m, tinggi 8 m, berisi kolam persegi 3 m × 3 m.',
        items: [
          essay('4.1', 'Jelaskan strategimu untuk menghitung luas bagian taman yang ditanami rumput. Tuliskan dalam bentuk kalimat atau ekspresi matematika (belum perlu dihitung).'),
          essay('4.2', 'Harga rumput beserta pemasangannya Rp25.000 per m². Sekolah menyediakan anggaran Rp2.500.000. Apakah anggaran tersebut cukup? Tunjukkan perhitunganmu.'),
        ],
      },
      {
        id: 'A5',
        title: 'Segitiga',
        context: 'Ilmiah / Sosial',
        sentences: ['Perhatikan tiga segitiga P, Q, dan R pada petak satuan berikut.', 'Ketiganya memiliki alas AB yang sama.'],
        figure: fig('A5_tiga_segitiga.svg'),
        figureAlt: 'Tiga segitiga pada petak satuan dengan alas AB 6 satuan dan tinggi 4 satuan; puncak R berada di luar alas.',
        items: [
          {
            no: '5.1',
            type: 'choice',
            prompt: 'Pernyataan yang benar tentang luas ketiga segitiga adalah … Jelaskan alasan pilihanmu.',
            choices: [
              { id: 'A', text: 'Luas P paling besar karena bentuknya paling seimbang.' },
              { id: 'B', text: 'Luas Q paling besar karena memiliki sudut siku-siku.' },
              { id: 'C', text: 'Luas R paling besar karena bentuknya paling panjang.' },
              { id: 'D', text: 'Luas ketiganya sama.' },
            ],
          },
          essay(
            '5.2',
            'OSIS membuat bendera berbentuk segitiga dengan alas 30 cm dan tinggi 40 cm. Ketua OSIS ingin membuat bendera baru yang luasnya dua kali luas bendera lama. Andi berkata: "Kalikan saja alas dan tingginya masing-masing dengan 2." Budi berkata: "Cukup alasnya saja yang dikalikan 2, tingginya tetap." Siapa yang benar? Jelaskan alasanmu dengan perhitungan.',
          ),
        ],
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
        title: 'Keramik Dapur Bu Sari',
        context: 'Personal',
        sentences: ['Dapur Bu Sari berbentuk persegi panjang dengan ukuran 3,3 m × 2,4 m.', 'Lantai dapur akan dipasangi keramik berbentuk persegi berukuran 60 cm × 60 cm.'],
        items: [
          essay('1.1', 'Berapa banyak keramik paling sedikit yang dibutuhkan agar seluruh lantai dapur tertutup? Tuliskan caramu.'),
          essay(
            '1.2',
            'Tukang keramik berkata, "Harus beli 24 keramik, karena 330 cm tidak habis dibagi 60 cm." Bu Sari menjawab, "Menurut hitunganku, 22 keramik sudah cukup." Menurutmu, bagaimana pendapat Bu Sari dan pendapat tukang? Jelaskan dengan memperhatikan cara keramik dipasang di lantai.',
          ),
        ],
      },
      {
        id: 'B2',
        title: 'Lahan Sayur Bu Wati',
        context: 'Pekerjaan',
        sentences: ['Bu Wati memiliki lahan sayur berbentuk jajar genjang seperti gambar berikut.'],
        figure: fig('B2_lahan_jajar_genjang.svg'),
        figureAlt: 'Jajar genjang dengan alas 20 m, sisi miring 10 m, dan tinggi 8 m.',
        items: [
          essay('2.1', 'Bu Wati menghitung luas lahannya: 20 × 10 = 200 m². Apakah perhitungan Bu Wati benar? Jelaskan alasanmu. (Kamu boleh menggambar untuk menjelaskan.)'),
          essay('2.2', 'Setiap 10 m² lahan membutuhkan 1 bungkus benih. Harga benih Rp15.000 per bungkus. Berapa biaya paling sedikit untuk membeli benih bagi seluruh lahan? Tuliskan caramu.'),
        ],
      },
      {
        id: 'B3',
        title: 'Hiasan Kelas',
        context: 'Personal',
        sentences: ['Siswa kelas 8A membuat hiasan dinding dari karton.', 'Hiasan berbentuk layang-layang dengan ukuran seperti gambar berikut.'],
        figure: fig('B3_hiasan_layang_layang.svg'),
        figureAlt: 'Layang-layang dengan diagonal 24 cm dan 25 cm (terbagi 9 cm dan 16 cm), sisi 15 cm dan 20 cm.',
        items: [
          essay('3.1', 'Tidak semua ukuran pada gambar diperlukan untuk menghitung luas satu hiasan. Ukuran mana yang kamu perlukan? Berapa luas karton untuk satu hiasan?'),
          essay(
            '3.2',
            'Kelas 8A akan membuat 20 hiasan. Karton dijual per lembar berukuran 50 cm × 60 cm. Siti menghitung: "20 × 300 = 6.000 cm². Satu lembar = 50 × 60 = 3.000 cm². 6.000 : 3.000 = 2. Jadi cukup membeli 2 lembar." Apakah 2 lembar benar-benar cukup? Berikan alasanmu dan tentukan banyak lembar yang menurutmu perlu dibeli.',
          ),
        ],
      },
      {
        id: 'B4',
        title: 'Halaman Sekolah',
        context: 'Sosial',
        sentences: ['Halaman parkir sekolah berbentuk trapesium.', 'Di dalamnya terdapat pos satpam berbentuk persegi panjang.', 'Seluruh halaman, kecuali pos satpam, akan dipasangi paving block.'],
        figure: fig('B4_halaman_trapesium.svg'),
        figureAlt: 'Trapesium siku-siku dengan sisi sejajar 12 m dan 18 m, tinggi 10 m, berisi pos satpam 4 m × 2,5 m.',
        items: [
          essay('4.1', 'Jelaskan strategimu untuk menghitung luas bagian halaman yang dipasangi paving block. Tuliskan dalam bentuk kalimat atau ekspresi matematika (belum perlu dihitung).'),
          essay('4.2', 'Harga paving block beserta pemasangannya Rp85.000 per m². Sekolah menyediakan anggaran Rp12.000.000. Apakah anggaran tersebut cukup? Tunjukkan perhitunganmu.'),
        ],
      },
      {
        id: 'B5',
        title: 'Segitiga',
        context: 'Ilmiah / Sosial',
        sentences: ['Perhatikan tiga segitiga K, L, dan M pada petak satuan berikut.', 'Ketiganya memiliki alas AB yang sama.'],
        figure: fig('B5_tiga_segitiga.svg'),
        figureAlt: 'Tiga segitiga pada petak satuan dengan alas AB 8 satuan dan tinggi 3 satuan; puncak M berada di luar alas.',
        items: [
          {
            no: '5.1',
            type: 'choice',
            prompt: 'Pernyataan yang benar tentang luas ketiga segitiga adalah … Jelaskan alasan pilihanmu.',
            choices: [
              { id: 'A', text: 'Luas K paling besar karena puncaknya tepat di tengah.' },
              { id: 'B', text: 'Luas L paling besar karena memiliki sudut siku-siku.' },
              { id: 'C', text: 'Luas M paling besar karena sisi miringnya paling panjang.' },
              { id: 'D', text: 'Luas ketiganya sama.' },
            ],
          },
          essay(
            '5.2',
            'Kelas 9C membuat spanduk berbentuk segitiga dengan alas 50 cm dan tinggi 20 cm. Mereka ingin membuat spanduk kecil yang luasnya setengah luas spanduk tersebut. Dewi berkata: "Bagi dua saja alas dan tingginya masing-masing." Eko berkata: "Cukup tingginya saja yang dibagi dua, alasnya tetap." Siapa yang benar? Jelaskan alasanmu dengan perhitungan.',
          ),
        ],
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
