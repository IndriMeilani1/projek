# Instrumen Pretest–Posttest Literasi Matematika
**Materi: Luas Bangun Datar · Jenjang: SMP (Fase D) · Kerangka: OECD/PISA 2022**

> **Sumber:** kisi-kisi pretest–posttest peneliti (Indri Meilani, 2225250141). Butir, kunci, dan skor per tahapan di dokumen ini disalin dari kisi-kisi tersebut dan diterapkan di `apps/web/src/content/tests.js` serta `apps/web/src/content/keys.js`. Ubah ketiganya bersamaan.

---

## 1. Spesifikasi Instrumen

| Aspek | Ketentuan |
|---|---|
| Tujuan | Mengukur kemampuan literasi matematika siswa pada materi luas bangun datar sebelum dan sesudah menggunakan GeOnePiece |
| Bentuk | **4 soal uraian** kontekstual per paket; satu soal untuk setiap indikator literasi matematika |
| Paket | **Paket A = Pretest**, **Paket B = Posttest**, paralel: indikator, bangun, dan tahapan penyelesaian sama; konteks dan angka berbeda |
| Waktu | 80 menit (dapat diubah di `TEST_RULES.durationMin`) |
| Alat bantu | Kalkulator diperbolehkan; kanvas sketsa dan Pembaca Soal tersedia tanpa umpan balik |
| Skor | Dinilai **per tahapan penyelesaian**; setiap soal maks **6** → skor mentah maks **24** |
| Nilai | **Nilai = (skor ÷ 24) × 100** → nilai maksimum pretest = **100**, nilai maksimum posttest = **100** |
| Pelaporan | Nilai total (0–100) + skor per indikator: Penalaran (R), Merumuskan (F), Menerapkan (E), Menafsirkan & Mengevaluasi (I) |

### 1.1 Rekapitulasi kisi-kisi dan penskoran

| No | Indikator literasi matematika | Kode | Pretest | Posttest |
|---|---|---|---|---|
| 1 | Mathematical Reasoning | R | 6 | 6 |
| 2 | Formulating Situations Mathematically | F | 6 | 6 |
| 3 | Employing Mathematical Concepts, Facts, and Procedures | E | 6 | 6 |
| 4 | Interpreting, Applying, and Evaluating Mathematical Outcomes | I | 6 | 6 |
| | **Skor mentah total** | | **24** | **24** |
| | **Nilai maksimum** (24 ÷ 24 × 100) | | **100** | **100** |

### 1.2 Struktur konstruk
Keempat soal merepresentasikan alur kemampuan **Mathematical Reasoning → Formulating → Employing → Interpreting and Evaluating**. Analisis penelitian dapat dilakukan berdasarkan nilai total literasi matematika sekaligus skor pada masing-masing indikator.

---

## 2. Kisi-Kisi

| No | Indikator | Soal Paket A (pretest) | Soal Paket B (posttest) | Bangun |
|---|---|---|---|---|
| 1 (R) | Siswa mampu mengidentifikasi hubungan matematis, membandingkan alternatif, memberikan alasan, dan menentukan keputusan yang dapat dipertanggungjawabkan. | Karpet ruang belajar 8 m × 6 m | Kain penutup meja 9 m × 5 m | Persegi panjang |
| 2 (F) | Siswa mampu mengidentifikasi informasi relevan, menentukan besaran, dan menerjemahkan situasi nyata menjadi model matematika. | Kebun sekolah, sisi 9 m | Halaman rumah, sisi 11 m | Persegi |
| 3 (E) | Siswa mampu memilih serta menggunakan konsep, operasi, prosedur, dan strategi matematika untuk memperoleh solusi. | Hiasan dinding, alas 12 cm, tinggi 8 cm | Bendera hias, alas 14 cm, tinggi 10 cm | Segitiga |
| 4 (I) | Siswa mampu menafsirkan hasil matematika dalam konteks, menilai kewajaran hasil, dan mengambil keputusan berdasarkan hasil perhitungan. | Ruang kelas 10 m × 7 m, klaim 70 m² | Teras rumah 12 m × 6 m, klaim 72 m² | Persegi panjang |

---

## 3. Petunjuk Pengerjaan (untuk siswa)
1. Berdoalah sebelum mengerjakan.
2. Bacalah setiap cerita dengan teliti. Kamu boleh menyorot informasi penting dengan alat **Pembaca Soal**.
3. Tuliskan **cara** dan **alasanmu**, bukan hanya jawaban akhir. Kamu boleh menggambar.
4. Kamu boleh memakai kalkulator.
5. Waktu mengerjakan 80 menit.

---

## 4. PAKET A — PRETEST

**Soal 1.** Sebuah ruang belajar memiliki lantai berbentuk persegi panjang dengan panjang 8 meter dan lebar 6 meter. Tersedia dua karpet dengan ukuran sebagai berikut:
- Karpet A memiliki luas 40 m².
- Karpet B memiliki luas 48 m².

Jika karpet harus menutupi seluruh lantai ruang belajar, karpet manakah yang sebaiknya dipilih? Jelaskan alasan matematis Anda!

**Soal 2.** Sebuah kebun sekolah berbentuk persegi memiliki panjang sisi 9 meter. Sekolah ingin mengetahui luas seluruh kebun untuk menentukan kebutuhan lahan penghijauan. Tentukan luas kebun tersebut dengan menggunakan model matematika yang sesuai!

**Soal 3.** Sebuah hiasan dinding berbentuk segitiga memiliki panjang alas 12 cm dan tinggi 8 cm. Berapakah luas hiasan dinding tersebut? Tunjukkan langkah perhitungan Anda!

**Soal 4.** Sebuah ruang kelas berbentuk persegi panjang memiliki panjang 10 meter dan lebar 7 meter. Seorang siswa menghitung luas ruang kelas tersebut dan memperoleh hasil 70 m². Apakah hasil perhitungan siswa tersebut benar? Jelaskan alasan Anda!

---

## 5. PAKET B — POSTTEST

**Soal 1.** Sebuah meja berbentuk persegi panjang memiliki panjang 9 meter dan lebar 5 meter. Tersedia dua kain penutup meja dengan ukuran sebagai berikut:
- Kain A memiliki luas 40 m².
- Kain B memiliki luas 45 m².

Jika kain harus menutupi seluruh permukaan meja, kain manakah yang sebaiknya dipilih? Jelaskan alasan matematis Anda!

**Soal 2.** Sebuah halaman rumah berbentuk persegi memiliki panjang sisi 11 meter. Pemilik rumah ingin mengetahui luas seluruh halaman tersebut sebelum memasang paving. Tentukan luas halaman rumah dengan menggunakan model matematika yang sesuai!

**Soal 3.** Sebuah bendera hias berbentuk segitiga memiliki panjang alas 14 cm dan tinggi 10 cm. Berapakah luas bendera hias tersebut? Tunjukkan langkah perhitungan Anda!

**Soal 4.** Sebuah teras rumah berbentuk persegi panjang memiliki panjang 12 meter dan lebar 6 meter. Seorang siswa menghitung luas teras tersebut dan memperoleh hasil 72 m². Apakah hasil perhitungan siswa tersebut benar? Jelaskan alasan Anda!

---

## 6. Kunci Jawaban & Pedoman Penskoran

### 6.1 Pedoman umum penskoran
1. Skor penuh diberikan apabila siswa menunjukkan tahapan penyelesaian yang benar dan menggunakan rumus luas bangun datar secara tepat.
2. Skor parsial tetap diberikan apabila siswa sudah menunjukkan tahapan berpikir yang benar, tetapi melakukan kesalahan perhitungan pada tahap berikutnya.
3. Jawaban akhir yang benar tanpa langkah penyelesaian perlu dinilai berdasarkan tahapan yang benar-benar ditunjukkan siswa.
4. Kesalahan dalam memilih rumus, memasukkan angka, dan melakukan operasi hitung dicatat sebagai bahan analisis kesulitan siswa.

### 6.2 Kunci per tahapan

**Soal 1 (R): total 6**

| Tahap | Paket A | Paket B | Skor |
|---|---|---|---|
| 1 | Mengidentifikasi informasi: lantai persegi panjang, panjang 8 m dan lebar 6 m | Meja persegi panjang, panjang 9 m dan lebar 5 m | 1 |
| 2 | Menentukan rumus luas persegi panjang L = p × l | idem | 2 |
| 3 | Menghitung luas lantai 8 × 6 = 48 m² | Luas meja 9 × 5 = 45 m² | 1 |
| 4 | Membandingkan: Karpet A = 40 m², Karpet B = 48 m² | Kain A = 40 m², Kain B = 45 m² | 1 |
| 5 | Karpet B lebih tepat karena luasnya sama dengan luas lantai | Kain B lebih tepat karena luasnya sama dengan luas permukaan meja | 1 |

**Soal 2 (F): total 6**

| Tahap | Paket A | Paket B | Skor |
|---|---|---|---|
| 1 | Mengidentifikasi panjang sisi kebun 9 m | Panjang sisi halaman 11 m | 1 |
| 2 | Menentukan bangun berbentuk persegi | idem | 1 |
| 3 | Menentukan model matematika L = s × s | idem | 1 |
| 4 | Memasukkan ukuran sisi: L = 9 × 9 | L = 11 × 11 | 1 |
| 5 | Menghitung L = 81 m² | L = 121 m² | 1 |
| 6 | Menyimpulkan luas kebun sekolah 81 m² | Luas halaman rumah 121 m² | 1 |

**Soal 3 (E): total 6**

| Tahap | Paket A | Paket B | Skor |
|---|---|---|---|
| 1 | Mengidentifikasi alas 12 cm dan tinggi 8 cm | Alas 14 cm dan tinggi 10 cm | 1 |
| 2 | Memilih rumus luas segitiga L = ½ × a × t | idem | 2 |
| 3 | Menghitung L = ½ × 12 × 8 = 48 cm² | L = ½ × 14 × 10 = 70 cm² | 2 |
| 4 | Menyimpulkan luas hiasan dinding 48 cm² | Luas bendera hias 70 cm² | 1 |

**Soal 4 (I): total 6**

| Tahap | Paket A | Paket B | Skor |
|---|---|---|---|
| 1 | Mengidentifikasi panjang 10 m dan lebar 7 m | Panjang 12 m dan lebar 6 m | 1 |
| 2 | Menentukan rumus luas persegi panjang L = p × l | idem | 1 |
| 3 | Menghitung L = 10 × 7 = 70 m² | L = 12 × 6 = 72 m² | 1 |
| 4 | Membandingkan hasil dengan jawaban siswa (sama-sama 70 m²) | Sama-sama 72 m² | 1 |
| 5 | Menilai bahwa hasil perhitungan tersebut benar | idem | 1 |
| 6 | Menyimpulkan luas ruang kelas 70 m² | Luas teras rumah 72 m² | 1 |

### 6.3 Konversi nilai

| Skor mentah | 0 | 6 | 12 | 18 | 24 |
|---|---|---|---|---|---|
| Nilai (skor ÷ 24 × 100) | 0 | 25 | 50 | 75 | **100** |

---

## 7. Lembar Validasi Ahli (ringkas)

Skala penilaian 1–4 (1 = tidak sesuai, 4 = sangat sesuai) untuk setiap butir:

| Aspek | Pernyataan |
|---|---|
| **Isi** | 1. Butir sesuai dengan indikator literasi matematika pada kisi-kisi |
| | 2. Butir sesuai dengan proses PISA yang dimaksud (R/F/E/I) |
| | 3. Konteks soal realistis dan dekat dengan kehidupan siswa SMP |
| | 4. Materi sesuai dengan CP/ATP luas bangun datar |
| **Konstruksi** | 5. Gambar jelas, ukuran terbaca, dan sesuai dengan cerita |
| | 6. Kunci jawaban dan skor per tahapan jelas dan dapat diterapkan |
| | 7. Butir paket A dan B setara (isomorfik) |
| **Bahasa** | 8. Kalimat menggunakan Bahasa Indonesia yang baik dan benar |
| | 9. Kalimat tidak berbelit-belit dan tidak menimbulkan tafsiran ganda |
| | 10. Panjang teks sesuai untuk siswa SMP |

Kolom saran perbaikan disediakan untuk setiap butir.

---

## 8. Rencana Analisis Instrumen

| Tahap | Analisis | Rumus/kriteria |
|---|---|---|
| Validitas isi | **Aiken's V** | V = Σs ÷ [n(c − 1)], s = r − l₀ (r = skor validator, l₀ = skor terendah, c = banyak kategori, n = banyak validator). Bandingkan dengan nilai kritis tabel Aiken sesuai n dan c. |
| Uji coba (kelas di luar sampel) | Validitas butir | Korelasi *product moment* skor butir–skor total; valid jika r hitung > r tabel (α = 0,05) |
| | Reliabilitas | **Cronbach's alpha**; reliabel jika α ≥ 0,70 |
| | Tingkat kesukaran (uraian) | P = rata-rata skor butir ÷ skor maksimum; 0,00–0,30 sukar · 0,31–0,70 sedang · 0,71–1,00 mudah |
| | Daya pembeda (uraian) | DP = (rata-rata kelompok atas − rata-rata kelompok bawah) ÷ skor maksimum, kelompok 27%; ≥ 0,40 sangat baik · 0,30–0,39 baik · 0,20–0,29 cukup (revisi) · < 0,20 buang/revisi total |
| | Kesetaraan paket A–B | Kelompok uji coba mengerjakan kedua paket (urutan diselang-seling/*counterbalanced*); bandingkan rata-rata (uji-t berpasangan, diharapkan tidak berbeda signifikan) dan korelasi skor A–B |
| | Reliabilitas antar-penilai | Dua penilai menskor 20–30% lembar jawaban; Cohen's kappa / ICC |
| Uji lapangan | Efektivitas | N-gain = (nilai post − nilai pre) ÷ (100 − nilai pre); kategori Hake: g ≥ 0,7 tinggi · 0,3 ≤ g < 0,7 sedang · g < 0,3 rendah. Uji normalitas → *paired t-test* atau Wilcoxon; ukuran efek Cohen's d. Analisis juga per proses (R, F, E, I). |

Semua analisis ini disiapkan sebagai skrip Python di `services/api/app/analysis/` dan `analysis/notebooks/`.

---

## 9. Catatan untuk Pengembangan Aplikasi
- Butir disimpan di `apps/web/src/content/tests.js` (Paket A & B); kunci dan skor per tahapan di `apps/web/src/content/keys.js`.
- Mode Guru menilai setiap soal per tahap (tombol 0…skor maks tahap). Skor soal = jumlah tahap (maks 6); nilai = skor ÷ 24 × 100.
- Ekspor CSV: kolom `soal_1`…`soal_4` (0–6), `total` (0–24), `nilai` (0–100), dan `R`, `F`, `E`, `I`.
- Soal tes **tidak boleh** muncul di modul belajar/latihan. Latihan memakai konteks dan angka yang berbeda.
