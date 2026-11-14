# PRD — GeOnePiece
**Product Requirement Document · Aplikasi Web & PWA Pembelajaran Luas Bangun Datar Berbasis Literasi Matematika untuk Siswa SMP**

| Atribut | Isi |
|---|---|
| Nama produk | GeOnePiece (*Geometry — One Piece*: "satu potongan" — memotong, menggeser, dan menyusun ulang bangun datar) |
| Versi dokumen | 0.1 (draf perencanaan) |
| Pemilik produk | Mahasiswa S1 Pendidikan Matematika, Universitas Sultan Ageng Tirtayasa |
| Platform | Web (desktop & mobile browser) + PWA terpasang di Android/iOS tanpa Play Store |
| Teknologi | React + Vite (JavaScript), Tailwind CSS, Motion (Framer Motion), Python (FastAPI) untuk backend & analisis data |
| Status | Perencanaan — belum ada kode |

---

## 1. Ringkasan Produk

GeOnePiece adalah aplikasi pembelajaran interaktif untuk materi **Luas Bangun Datar** di SMP (Fase D). Siswa membangun pemahaman konsep luas dengan **memanipulasi bangun secara visual** — memotong segitiga dari jajar genjang lalu menggesernya menjadi persegi panjang, mengubah alas dan tinggi secara dinamis, dan menyorot unsur-unsur bangun — kemudian menerapkannya pada **masalah kontekstual bergaya PISA**. Aplikasi dilengkapi **instrumen pretest–posttest literasi matematika** untuk mengukur dampak pembelajaran.

Prinsip intinya: *rumus ditemukan, bukan dihafal*. Setiap rumus luas diturunkan dari satu ide — **luas tidak berubah ketika bangun dipotong dan disusun ulang** — sehingga siswa tidak lagi perlu menghafal banyak rumus yang terpisah-pisah.

---

## 2. Latar Belakang & Masalah

### 2.1 Temuan studi pendahuluan (wawancara siswa S01, kelas 9, 9 November 2026)

Wawancara dikodekan dengan kerangka **Cognitive Load Theory** (IL = *intrinsic load*, EL = *extraneous load*, GL = *germane load*, K = konteks, DS = saran desain). Temuan dan implikasinya:

| Kode | Temuan (parafrase) | Jenis beban | Implikasi desain |
|---|---|---|---|
| K02, EL04 | Materi dijelaskan di papan tulis; terlalu cepat bagi sebagian siswa, harus minta diulang | EL | Pembelajaran **dikendalikan siswa** (*learner-paced*), bisa diulang kapan saja |
| K03, IL02 | Ragu memakai rumus yang mana; pernah tertukar rumus | IL | Langkah wajib **"Kenali bangunnya dulu"** + peta konsep keterkaitan rumus |
| IL01, IL03 | Jajar genjang paling sulit; strategi utama = menghafal rumus | IL | **Simulasi potong–geser** jajar genjang → persegi panjang sebagai titik masuk; rumus diturunkan, bukan dihafal |
| IL04, IL05 | Kesulitan menghitung angka besar | IL/EL | Kalkulator di layar (bisa diatur guru), angka bertahap dari kecil ke besar |
| EL01, EL05 | Soal cerita berbelit-belit dan panjang, sulit mencari informasi | EL | Alat **"Pembaca Soal"**: sorot informasi → tabel *Diketahui / Ditanya* otomatis |
| EL03 | Garis tinggi digambar di luar gambar sehingga membingungkan | EL (*split-attention*) | Label & garis tinggi **terintegrasi di dalam gambar**, *highlight* sinkron antara gambar dan rumus |
| GL01, GL02 | Belajar dengan berdiskusi dan bertanya ke guru untuk memastikan jawaban | GL | Umpan balik langsung, tombol *"Cek jawabanku"*, prompt penjelasan |
| GL03, GL05 | Mencari contoh soal lain/yang mirip | GL | Generator **soal mirip** (isomorfik) setelah contoh |
| GL04 | Menjelaskan kepada teman | GL | Prompt **"Jelaskan ke teman"** (*self-explanation*) |
| DS01 | Ingin video, petunjuk pengerjaan, latihan bervariasi | — | Video singkat, petunjuk bertingkat, bank soal bervariasi |
| DS02 | Penjelasan pelan-pelan dari contoh soal | — | **Contoh soal langkah demi langkah** (*worked example*) dengan tombol "langkah berikutnya" |
| DS03 | Materi singkat tetapi lengkap; boleh banyak menu asal semuanya ada | — | **Mikro-pelajaran** 3–5 menit, navigasi jelas |

> **Catatan metodologis:** Data saat ini berasal dari satu siswa. Disarankan menambah responden (siswa lain dan guru) agar analisis kebutuhan kuat. Periksa juga pengodean GL01 dan GL02 — kolom kodenya berisi "EL" padahal berkode GL.

### 2.2 Pernyataan masalah
Siswa SMP memandang luas bangun datar sebagai kumpulan rumus yang harus dihafal, kesulitan mengenali bangun dan unsur-unsurnya (terutama tinggi), serta kesulitan mengekstrak informasi dari soal kontekstual. Akibatnya kemampuan **merumuskan, menerapkan, menafsirkan, dan bernalar** — inti literasi matematika — belum berkembang.

---

## 3. Tujuan

### 3.1 Tujuan pembelajaran
Setelah menggunakan GeOnePiece, siswa mampu:
1. Menjelaskan konsep luas sebagai banyaknya persegi satuan yang menutupi suatu daerah.
2. Menurunkan rumus luas persegi, persegi panjang, segitiga, jajar genjang, trapesium, belah ketupat, dan layang-layang melalui transformasi potong–geser–susun ulang (serta lingkaran pada fase 2).
3. Mengidentifikasi alas dan tinggi yang tepat (termasuk tinggi yang berada di luar bangun).
4. Merumuskan, menerapkan, menafsirkan, dan menalar masalah kontekstual yang melibatkan luas bangun datar dan bangun gabungan.

### 3.2 Tujuan produk
- PWA yang dapat dipasang dan berjalan **offline** di HP Android kelas menengah ke bawah.
- Simulasi visual yang mulus (target 60 fps) dan mudah digunakan dengan sentuhan.
- Instrumen pretest–posttest terintegrasi dengan penilaian semi-otomatis dan ekspor data.

### 3.3 Tujuan penelitian
- Menyediakan data pretest–posttest (skor total dan skor per proses literasi) untuk analisis **N-gain** dan uji beda.
- Mencatat data penggunaan (waktu pada simulasi, jumlah petunjuk yang dibuka) sebagai data pendukung.
- Mendukung model pengembangan (mis. ADDIE/4D/Plomp) yang biasa dipakai dalam skripsi R&D: validasi ahli → uji praktikalitas → uji efektivitas.

---

## 4. Target Pengguna

| Persona | Deskripsi | Kebutuhan utama |
|---|---|---|
| **Siswa — "Raka", 13–15 th** | Siswa SMP kelas 7–9 (Fase D), memakai HP Android milik sendiri/keluarga, kuota terbatas, cepat bosan dengan teks panjang | Materi singkat, visual, bisa diulang, offline, umpan balik langsung |
| **Guru — "Bu Sari"** | Guru matematika SMP, jumlah kelas banyak, waktu terbatas | Membuka/menutup tes, memantau progres, menilai uraian dengan rubrik, mengekspor nilai |
| **Peneliti/Admin — mahasiswa** | Menjalankan uji coba dan penelitian | Mengelola kelas & bank soal, mengekspor data mentah, menjalankan analisis statistik |
| **Validator ahli** (sekunder) | Dosen/guru yang menilai kelayakan media dan instrumen | Mode pratinjau tanpa login siswa, lembar validasi |

---

## 5. Ruang Lingkup Materi

| Modul | Bangun | Ide transformasi kunci | Prioritas |
|---|---|---|---|
| M0 | Konsep luas & satuan luas | Menutup daerah dengan persegi satuan; konversi cm² ↔ m² | MVP |
| M1 | Persegi & persegi panjang | Menghitung petak satuan → baris × kolom | MVP |
| M2 | Jajar genjang | Potong segitiga di satu sisi → geser → persegi panjang | MVP |
| M3 | Segitiga | Dua segitiga kongruen → jajar genjang; atau potong di garis tengah → persegi panjang | MVP |
| M4 | Trapesium | Dua trapesium kongruen → jajar genjang dengan alas (a + b) | MVP |
| M5 | Belah ketupat & layang-layang | Di dalam persegi panjang d₁ × d₂ → tepat setengahnya | MVP |
| M6 | Bangun gabungan | Dekomposisi (memecah) & selisih luas | MVP |
| M7 | Lingkaran | Juring disusun ulang → mendekati jajar genjang/persegi panjang | Fase 2 |

> Selaraskan pemetaan modul dengan Capaian Pembelajaran Fase D (elemen Pengukuran dan Geometri) serta ATP sekolah mitra. Verifikasi dengan dokumen CP yang berlaku saat penelitian.

---

## 6. Kerangka & Indikator Literasi Matematika (OECD/PISA 2022)

PISA 2022 mendefinisikan literasi matematika sebagai kapasitas individu untuk **bernalar secara matematis** serta **merumuskan, menerapkan, dan menafsirkan** matematika untuk memecahkan masalah dalam berbagai konteks dunia nyata. Kerangka yang dipakai GeOnePiece:

### 6.1 Dimensi
- **Proses (4):** Penalaran Matematis · Merumuskan · Menerapkan · Menafsirkan & Mengevaluasi
- **Konten:** *Ruang dan Bentuk* (utama), *Kuantitas* (pendukung: satuan, perhitungan, estimasi)
- **Konteks (4):** Personal · Pekerjaan · Sosial/Kemasyarakatan · Ilmiah (termasuk soal intra-matematis)

### 6.2 Indikator literasi matematika untuk materi luas bangun datar

| Kode | Proses | Indikator | Perilaku yang teramati | Fitur pendukung |
|---|---|---|---|---|
| **R1** | Penalaran | Menjelaskan mengapa suatu rumus luas berlaku dengan argumen transformasi (potong–geser–susun) | "Luas jajar genjang = a × t karena segitiga yang dipotong menutup celah di sisi lain" | Simulasi potong–geser, prompt *"Jelaskan ke teman"* |
| **R2** | Penalaran | Menalar perubahan luas ketika unsur bangun berubah (alas/tinggi diperbesar, bangun digeser) | "Jika alas dua kali, luas dua kali; jika alas dan tinggi dua kali, luas empat kali" | Slider alas–tinggi dinamis, mode "Prediksi dulu" |
| **F1** | Merumuskan | Mengidentifikasi informasi penting dan bangun datar yang relevan dalam situasi kontekstual | Menuliskan *Diketahui/Ditanya*, mengabaikan informasi yang tidak perlu | Alat Pembaca Soal, langkah "Kenali bangunnya" |
| **F2** | Merumuskan | Mengubah masalah menjadi model matematis (sketsa, ekspresi, strategi dekomposisi) | "Luas rumput = luas trapesium − luas kolam" | Kanvas sketsa, editor strategi |
| **E1** | Menerapkan | Memilih dan menggunakan rumus/prosedur luas dengan tepat, termasuk alas–tinggi yang berpasangan | Memakai tinggi tegak lurus, bukan sisi miring | Highlight alas–tinggi, latihan bertingkat |
| **E2** | Menerapkan | Melakukan perhitungan dan konversi satuan dengan akurat | cm ↔ m, cm² ↔ m², pembagian & perkalian dengan uang | Kalkulator, konverter satuan terpandu |
| **I1** | Menafsirkan | Menafsirkan hasil perhitungan kembali ke konteks masalah | "Jadi dibutuhkan 4 lembar kertas, bukan 1,83 lembar" | Langkah wajib "Apa artinya?" |
| **I2** | Mengevaluasi | Mengevaluasi kewajaran solusi/klaim dan keterbatasan model | Menilai klaim tukang atau teman, mempertimbangkan sisa potongan | Soal "Siapa yang benar?" |

### 6.3 Pemetaan ke level kecakapan (adaptasi untuk keperluan deskriptif)
| Kategori | Ciri |
|---|---|
| Rendah (≈ PISA level 1–2) | Menjawab soal rutin dengan informasi eksplisit dan rumus langsung |
| Sedang (≈ level 3–4) | Memilih strategi, memakai dekomposisi sederhana, menafsirkan hasil |
| Tinggi (≈ level 5–6) | Memodelkan situasi kompleks, mengevaluasi klaim, memberi argumen yang runtut |

---

## 7. Prinsip Desain Pembelajaran

| Prinsip (CLT / Multimedia Learning) | Penerapan di GeOnePiece |
|---|---|
| *Split-attention* & *spatial contiguity* | Label, garis tinggi, dan angka menempel pada gambar; rumus tampil tepat di bawah bangun |
| *Signaling* | Pewarnaan konsisten: **alas = biru**, **tinggi = oranye**, **diagonal = ungu**, **potongan = hijau**; elemen yang diklik menyala di gambar *dan* di rumus |
| *Segmenting* & *learner pacing* | Mikro-pelajaran 3–5 menit, tombol "Lanjut" dikendalikan siswa |
| *Worked example* → *faded example* | Contoh lengkap → contoh dengan langkah kosong → soal mandiri |
| *Concreteness fading* | Konkret (potong–geser) → semi-konkret (petak satuan) → abstrak (simbol rumus) |
| *Self-explanation* | Prompt "Jelaskan ke teman" dan "Kenapa begitu?" |
| *Redundancy* dihindari | Narasi audio opsional, tidak membacakan ulang teks yang sama |
| *Productive failure* ringan | Mode "Prediksi dulu" sebelum simulasi dijalankan |

---

## 8. User Stories

Format: *Sebagai [peran], saya ingin [aksi], agar [manfaat]* — beserta kriteria penerimaan (AC).

### Epik A — Akses & Onboarding
- **US-A1** Sebagai siswa, saya ingin masuk dengan **kode kelas + kode siswa** tanpa email, agar mudah dan data saya tetap anonim.
  AC: login < 30 detik; tidak meminta nama lengkap, email, atau nomor HP.
- **US-A2** Sebagai siswa, saya ingin **memasang aplikasi ke layar utama HP** tanpa Play Store, agar bisa membukanya seperti aplikasi biasa.
  AC: muncul ajakan pasang; ikon & *splash screen* tampil; skor Lighthouse kategori PWA lolos.
- **US-A3** Sebagai siswa, saya ingin aplikasi tetap bisa dipakai **saat offline**, agar kuota dan sinyal tidak menghambat.
  AC: semua modul MVP dan tes tersedia offline setelah kunjungan pertama; jawaban disinkronkan saat online.

### Epik B — Modul Belajar
- **US-B1** Sebagai siswa, saya ingin materi **singkat per langkah** yang bisa saya atur kecepatannya, agar tidak tertinggal seperti saat dijelaskan di papan tulis.
- **US-B2** Sebagai siswa, saya ingin **contoh soal dijelaskan pelan-pelan langkah demi langkah**, agar saya paham asal setiap angka.
  AC: setiap langkah muncul setelah tombol "Langkah berikutnya"; bagian gambar yang relevan menyala.
- **US-B3** Sebagai siswa, saya ingin **video singkat** (≤ 3 menit) per modul, agar bisa belajar dengan cara lain.
- **US-B4** Sebagai siswa, saya ingin **peta "Kenali bangunnya dulu"**, agar tidak salah memilih rumus.
- **US-B5** Sebagai siswa, saya ingin melihat **hubungan antar-rumus** (semua berasal dari persegi panjang), agar tidak perlu menghafal satu per satu.

### Epik C — Simulasi Interaktif
- **US-C1** Sebagai siswa, saya ingin **memotong segitiga dari jajar genjang lalu menggesernya** menjadi persegi panjang, agar saya mengerti mengapa luasnya alas × tinggi.
  AC: potongan dapat diseret dengan jari; menempel (*snap*) bila dekat posisi tujuan; animasi ≥ 55 fps di HP kelas menengah.
- **US-C2** Sebagai siswa, saya ingin **menggeser/mengubah alas dan tinggi secara dinamis** dan melihat luas berubah *real-time*, agar saya bisa menebak dan menguji pola.
- **US-C3** Sebagai siswa, saya ingin **menekan/menyeret unsur bangun** (alas, tinggi, sisi, diagonal) dan melihatnya **menyala** bersama simbolnya pada rumus, agar tidak bingung antara sisi miring dan tinggi.
- **US-C4** Sebagai siswa, saya ingin **menggeser puncak segitiga sejajar alas** dan melihat luas tetap, agar paham bahwa segitiga dengan alas dan tinggi sama mempunyai luas sama walaupun tingginya di luar bangun.
- **US-C5** Sebagai siswa, saya ingin **menggandakan dan memutar** segitiga/trapesium untuk membentuk jajar genjang, agar paham asal "÷ 2".
- **US-C6** Sebagai siswa, saya ingin **memecah bangun gabungan** menjadi bangun sederhana dengan mengetuk garis potong.

### Epik D — Latihan & Literasi
- **US-D1** Sebagai siswa, saya ingin alat **Pembaca Soal** untuk menyorot informasi penting di soal cerita, agar soal panjang tidak membingungkan.
  AC: teks yang disorot masuk ke tabel *Diketahui*; ada kolom *Ditanya*; bisa ditandai "informasi tidak diperlukan".
- **US-D2** Sebagai siswa, saya ingin **petunjuk bertingkat** (petunjuk 1 → 2 → contoh), agar saya dibantu seperlunya.
- **US-D3** Sebagai siswa, saya ingin **soal mirip** setelah menyelesaikan contoh, agar saya yakin sudah paham.
- **US-D4** Sebagai siswa, saya ingin **kalkulator** di layar, agar angka besar tidak menghalangi saya fokus pada strategi.
- **US-D5** Sebagai siswa, saya ingin **umpan balik yang menjelaskan kesalahan** (mis. "Kamu memakai sisi miring, bukan tinggi"), bukan hanya benar/salah.

### Epik E — Evaluasi (Pretest–Posttest)
- **US-E1** Sebagai peneliti, saya ingin **membuka pretest/posttest per kelas** pada jadwal tertentu, agar pelaksanaan terkontrol.
- **US-E2** Sebagai siswa, saya ingin jawaban saya **tersimpan otomatis** (juga saat offline), agar tidak hilang jika HP mati atau sinyal putus.
- **US-E3** Sebagai siswa, saya ingin menjawab soal uraian dengan **teks dan sketsa**, agar bisa menunjukkan cara berpikir saya.
- **US-E4** Sebagai guru/peneliti, saya ingin **menilai jawaban uraian dengan rubrik** di layar (skor 0–4 per butir), agar penilaian konsisten.
  AC: rubrik tampil di samping jawaban; mendukung dua penilai dan menghitung kesepakatan antar-penilai.
- **US-E5** Sebagai peneliti, saya ingin **mengekspor skor** (total, per proses literasi, per butir) ke CSV/XLSX dan melihat **N-gain**, agar analisis skripsi lebih cepat.
- **US-E6** Sebagai siswa, saya **tidak** mendapat petunjuk/umpan balik selama tes, agar hasil tes valid.

### Epik F — Dasbor Guru/Peneliti
- **US-F1** Sebagai guru, saya ingin melihat **progres modul per siswa** dan **miskonsepsi tersering**.
- **US-F2** Sebagai peneliti, saya ingin melihat **profil kemampuan per proses literasi** (R, F, E, I) pada pretest dan posttest.

---

## 9. Kebutuhan Fungsional (ringkas)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-01 | Autentikasi kode kelas + kode siswa; peran: siswa, guru, peneliti | MVP |
| FR-02 | Modul M0–M6: mikro-pelajaran, contoh langkah demi langkah, video, latihan | MVP |
| FR-03 | Simulasi S1–S7 (lihat RANCANGAN_FITUR.md) | MVP (S8 Fase 2) |
| FR-04 | Pembaca Soal (sorot → Diketahui/Ditanya) | MVP |
| FR-05 | Petunjuk bertingkat & umpan balik berbasis miskonsepsi | MVP |
| FR-06 | Mesin tes: paket A/B, timer, autosimpan, mode terkunci, sketsa | MVP |
| FR-07 | Penilaian otomatis (pilihan ganda, isian numerik) + penilaian rubrik (uraian) | MVP |
| FR-08 | Dasbor guru/peneliti, ekspor CSV/XLSX | MVP |
| FR-09 | Analisis statistik (N-gain, validitas, reliabilitas, uji beda) via Python | MVP (skrip) → Fase 2 (UI) |
| FR-10 | Pencatatan event pembelajaran (anonim) | MVP |
| FR-11 | Narasi audio, mode kontras tinggi | Fase 2 |

## 10. Kebutuhan Non-Fungsional

| Aspek | Target |
|---|---|
| Performa | Muat pertama < 3 detik di 4G; bundel JS awal < 250 KB gzip; animasi 60 fps (minimal 55 fps di HP RAM 3 GB) |
| Offline | Service worker (Workbox) *precache* aset & konten; IndexedDB untuk jawaban & progres |
| Kompatibilitas | Chrome Android ≥ 2 versi terakhir, Safari iOS 16+, desktop Chrome/Edge/Firefox |
| Responsif | Mobile-first, 360 px ke atas; mendukung orientasi potret & lanskap |
| Aksesibilitas | Target sentuh ≥ 44 px; kontras WCAG AA; warna tidak menjadi satu-satunya penanda (warna + pola/label); mematuhi `prefers-reduced-motion` |
| Privasi | Siswa di bawah umur: tanpa PII; persetujuan sekolah/orang tua; data disimpan dengan kode; dapat dihapus atas permintaan |
| Bahasa | Antarmuka Bahasa Indonesia baku yang ramah remaja |
| Keamanan | HTTPS; token per sesi; tes dikunci di sisi server (jadwal & paket) |

---

## 11. Metrik Keberhasilan

| Metrik | Target |
|---|---|
| Kevalidan media (validasi ahli) | Kategori "valid/sangat valid" |
| Kepraktisan (angket siswa & guru) | Kategori "praktis/sangat praktis" |
| Efektivitas — N-gain literasi matematika | Rata-rata ≥ 0,3 (sedang); idealnya ≥ 0,7 (tinggi) pada sebagian siswa |
| Uji beda pretest–posttest | Signifikan (α = 0,05) |
| Penyelesaian modul | ≥ 80% siswa menyelesaikan M0–M6 |
| Performa teknis | 0 kehilangan data jawaban tes; *crash-free session* ≥ 99% |

---

## 12. Rencana Rilis

| Tahap | Isi | Keluaran |
|---|---|---|
| **0 — Fondasi** | Setup monorepo, PWA dasar, sistem desain, pustaka geometri + tes | Kerangka jalan offline |
| **1 — Prototipe simulasi** | S1 (petak satuan), S2 (jajar genjang potong–geser), S3 (alas–tinggi dinamis) | Uji kegunaan dengan 3–5 siswa |
| **2 — MVP belajar** | M0–M6, Pembaca Soal, petunjuk, latihan | Validasi ahli media & materi |
| **3 — Evaluasi** | Mesin tes, paket A/B, rubrik, dasbor, ekspor | Validasi ahli instrumen, uji coba instrumen |
| **4 — Uji lapangan** | Perbaikan, analisis Python, laporan | Data penelitian |
| **5 — Fase 2** | Lingkaran, audio, mode kolaborasi | Pengembangan lanjut |

---

## 13. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| HP siswa lambat → animasi patah-patah | Animasikan hanya `transform`/`opacity`, SVG ringan, uji di perangkat murah sejak tahap 1 |
| Tidak semua siswa punya HP/kuota | Mode offline penuh; satu perangkat bisa dipakai bergantian (ganti kode siswa) |
| Kebocoran soal pretest ke posttest | Paket A & B paralel (isomorfik) — bukan soal yang sama; soal tes tidak ditampilkan di latihan |
| Penilaian uraian subjektif | Rubrik analitik + dua penilai + hitung reliabilitas antar-penilai |
| Nama "GeOnePiece" mirip judul anime terkenal | Pakai identitas visual **orisinal** (tema "potongan" geometri); **jangan** memakai karakter, logo, font, atau aset dari anime tersebut |
| Data siswa di bawah umur | Tanpa PII, *informed consent*, penyimpanan terenkripsi, retensi terbatas |

## 14. Di Luar Lingkup (MVP)
- Rilis ke Play Store (bisa nanti via *Trusted Web Activity*).
- Fitur obrolan/forum siswa.
- Penilaian uraian otomatis berbasis AI.
- Materi keliling dan bangun ruang.

## 15. Pertanyaan Terbuka
1. Model pengembangan yang dipakai (ADDIE, 4D, atau Plomp)? Ini memengaruhi urutan validasi.
2. Kelas sasaran uji coba: kelas 7, 8, atau 9? (Siswa S01 adalah kelas 9 yang mempelajari materi ini di kelas 8.)
3. Desain penelitian: *one-group pretest–posttest* atau kelas eksperimen–kontrol?
4. Apakah kalkulator diizinkan saat tes? (Rekomendasi: **ya**, karena literasi menekankan pemodelan dan PISA berbasis komputer juga menyediakan kalkulator.)
5. Durasi tes yang disediakan sekolah (rekomendasi 80 menit = 2 JP).

---
*Dokumen terkait:* `CLAUDE.md` · `docs/RANCANGAN_FITUR.md` · `docs/STRUKTUR_FOLDER.md` · `docs/INSTRUMEN_PRETEST_POSTTEST.md`
