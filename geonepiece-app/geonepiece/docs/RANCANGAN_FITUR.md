# Rancangan Fitur Utama — GeOnePiece

Dokumen ini menjabarkan fitur dari PRD menjadi spesifikasi yang siap dikodekan: alur layar, perilaku interaksi, animasi, dan data.

---

## 0. Peta Aplikasi

```
Beranda (Peta Petualangan)
├── 🧭 Mulai: Pretest (terkunci sampai dibuka guru)
├── 📚 Belajar
│   ├── M0 Konsep Luas & Satuan
│   ├── M1 Persegi & Persegi Panjang
│   ├── M2 Jajar Genjang
│   ├── M3 Segitiga
│   ├── M4 Trapesium
│   ├── M5 Belah Ketupat & Layang-layang
│   └── M6 Bangun Gabungan
│       (setiap modul: Pemantik → Simulasi → Rumus → Contoh → Latihan → Tantangan Literasi)
├── 🧪 Laboratorium Bebas (semua simulasi tanpa skenario)
├── 🏋️ Latihan (bank soal per level & per proses literasi)
├── 🧠 Peta Rumus ("Kenali bangunnya dulu")
├── 🏁 Posttest (terkunci sampai dibuka guru)
└── 👤 Profil & Progres

Dasbor Guru/Peneliti (rute terpisah: /guru)
├── Kelas & kode siswa
├── Jadwal tes (buka/tutup paket A/B)
├── Penilaian rubrik
├── Progres & miskonsepsi
└── Ekspor & analisis
```

Navigasi bawah (mobile): **Beranda · Belajar · Lab · Latihan · Profil**. Sesuai DS03, banyak menu boleh, asal setiap menu jelas dan berlabel.

---

## 1. Modul Belajar

### 1.1 Struktur satu modul (alur 6 langkah, ±15–20 menit)

| Langkah | Isi | Prinsip | Durasi |
|---|---|---|---|
| 1. **Pemantik** | Masalah kontekstual singkat + pertanyaan "Menurutmu…?" (prediksi) | Aktivasi, *productive failure* ringan | 1 menit |
| 2. **Simulasi** | Manipulasi potong–geser–susun yang dipandu (lihat §2) | Konkret | 4–6 menit |
| 3. **Temukan Rumus** | Siswa menyusun rumus dengan menyeret token (`a`, `t`, `×`, `÷ 2`, `( + )`) yang menyala sinkron dengan gambar | Concreteness fading | 2 menit |
| 4. **Contoh Langkah demi Langkah** | *Worked example* → *faded example* (1–2 langkah dikosongkan) | Worked example, DS02 | 3 menit |
| 5. **Latihan** | 4–6 soal bertingkat + petunjuk bertingkat + soal mirip | Latihan terdistribusi | 4 menit |
| 6. **Tantangan Literasi** | 1 soal kontekstual bergaya PISA dengan Pembaca Soal | Transfer | 3–5 menit |

Opsional di setiap modul: **Video ≤ 3 menit** (DS01), tombol **"Jelaskan ke teman"** (rekam ringkasan teks/suara pendek, GL04).

### 1.2 Contoh Langkah demi Langkah (*Worked Example Player*)
- Setiap langkah = `{ teks, ekspresiKaTeX, highlight: [idUnsur], animasi }`.
- Tombol **"Langkah berikutnya"** (bukan auto-play) dan **"Ulangi langkah"**.
- Unsur gambar yang dirujuk pada langkah itu menyala (*signaling*); unsur lain meredup ke 40% opasitas.
- *Faded example*: langkah kosong berupa isian; jika salah 2 kali → muncul petunjuk tingkat 1.

### 1.3 Peta Rumus — "Kenali Bangunnya Dulu" (mengatasi K03/IL02)
- Diagram pohon interaktif: **Persegi panjang** di pusat → panah ke jajar genjang (potong–geser), segitiga (½ jajar genjang), trapesium (½ jajar genjang beralas a+b), belah ketupat/layang-layang (½ persegi panjang d₁×d₂), persegi (kasus khusus).
- Ketuk panah → memutar animasi transformasi singkat (3 detik).
- **Kuis pengenal bangun**: diberi gambar (diputar/miring), siswa menebak nama bangun dan menandai alas–tinggi.

---

## 2. Simulasi Interaktif (inti produk)

### 2.1 Komponen bersama
- **Kanvas geometri** berbasis SVG dengan sistem koordinat dunia (1 satuan = 1 petak); `viewBox` responsif.
- **Petak satuan** (*grid*) bisa dinyalakan/dimatikan; *snap-to-grid* opsional (default nyala untuk SMP kelas 7).
- **Pegangan (*handle*)** titik sudut: lingkaran berdiameter 28 px yang terlihat, area sentuh 48 px.
- **Panel ukur** menempel di bawah kanvas: `alas = 8`, `tinggi = 5`, `Luas = 40 satuan²` — angka yang sedang berubah berdenyut halus.
- **Rumus hidup**: `L = a × t` dengan setiap simbol berwarna sama dengan unsurnya di gambar.

### 2.2 Kode warna semantik (dipakai di seluruh aplikasi)
| Unsur | Warna | Pola tambahan (untuk buta warna) |
|---|---|---|
| Alas | Biru | Garis tebal |
| Tinggi | Oranye | Garis putus-putus + simbol siku-siku ⊾ |
| Sisi miring | Abu-abu | Garis tipis |
| Diagonal | Ungu | Garis titik-titik |
| Potongan yang dipindah | Hijau | Arsir diagonal |
| Daerah luas | Biru muda transparan | — |

### 2.3 Interactive Highlighting (S0, berlaku di semua simulasi)
- **Ketuk** unsur (alas/tinggi/sisi/diagonal) → unsur menebal + bercahaya, label muncul *di dalam* gambar (mengatasi EL03), simbol yang sesuai di rumus menyala.
- **Ketuk simbol di rumus** → unsur di gambar menyala (dua arah).
- **Tekan lama/seret** di sepanjang unsur → muncul pita ukur dengan panjangnya.
- Unsur yang bukan dirujuk meredup — mengurangi beban visual.
- **Mode "Cari Tingginya"**: siswa harus menyeret garis tinggi dari puncak hingga tegak lurus alas; aplikasi memeriksa sudut 90° (toleransi ±3°) dan memberi umpan balik bila siswa memilih sisi miring.

### 2.4 Daftar simulasi

#### S1 — Petak Satuan (M0, M1)
- Siswa menyeret persegi satuan untuk menutupi persegi panjang; penghitung naik.
- Setelah 1 baris penuh, tombol "Salin baris" → animasi baris menggandakan diri → muncul gagasan *baris × kolom*.
- Pengubah satuan: 1 m² = 100 cm × 100 cm = 10.000 cm² (animasi *zoom* satu petak m² berisi petak-petak cm²).

#### S2 — Jajar Genjang → Persegi Panjang ⭐ (M2, prioritas tertinggi karena IL01)
1. Jajar genjang tampil di atas petak satuan.
2. Siswa **menyeret garis potong** (oranye, selalu tegak lurus alas) ke posisi mana pun di dalam bangun.
3. Ketuk **"Potong ✂️"** → potongan segitiga (hijau) terlepas sedikit (animasi pegas).
4. Siswa **menyeret potongan** ke sisi seberang; bila jaraknya ≤ 16 px dari posisi target → *snap* + getar halus (Vibration API bila tersedia).
5. Terbentuk persegi panjang; panel menampilkan `Luas jajar genjang = Luas persegi panjang = a × t`.
6. Tombol **"Kembalikan"** memutar animasi terbalik.
- **Varian geser (shear)**: seret sisi atas mendatar → bangun berubah condong, **tinggi & alas tetap → luas tetap** (indikator "Luas tetap 40" dengan centang).
- **Kasus menantang**: jajar genjang sangat condong (garis tinggi dari puncak jatuh di luar alas) → siswa belajar bahwa satu potongan tidak cukup; aplikasi menawarkan "Potong lagi" (dua potongan).

#### S3 — Alas & Tinggi Dinamis (M1–M5)
- Dua slider + pegangan langsung pada gambar: **alas** (1–20) dan **tinggi** (1–15).
- Grafik mini (opsional) luas terhadap alas → garis lurus (pengantar proporsionalitas, mendukung indikator R2).
- **Mode "Prediksi dulu"**: "Jika alas dijadikan 2 kali, luasnya menjadi…?" → siswa memilih ×2/×3/×4 → jalankan → bandingkan.

#### S4 — Segitiga: Puncak Bergeser (M3; mendukung soal tinggi di luar bangun)
- Puncak segitiga bisa diseret **sejajar alas** di sepanjang garis bantu (rel); luas tetap.
- Saat puncak melewati ujung alas, garis tinggi berada di luar bangun dan alas diperpanjang dengan garis putus-putus — ditandai label *"tinggi boleh di luar segitiga"*.
- **Gandakan & Putar**: tombol "Gandakan" → salinan muncul → siswa memutarnya 180° (pegangan rotasi atau tombol putar) → *snap* membentuk jajar genjang → `L = ½ × a × t`.
- Alternatif: potong pada garis tengah (setengah tinggi) → putar potongan atas → persegi panjang `a × ½t`.

#### S5 — Trapesium Kembar (M4)
- Gandakan trapesium, putar 180°, tempelkan → jajar genjang beralas `(a + b)`; sorot bahwa alas baru = jumlah dua sisi sejajar.
- Slider sisi atas `b`: bila `b → 0` trapesium menjadi segitiga; bila `b = a` menjadi jajar genjang (memperlihatkan keterkaitan rumus).

#### S6 — Belah Ketupat & Layang-layang (M5)
- Bangun digambar di dalam persegi panjang `d₁ × d₂` (garis putus-putus).
- Empat segitiga sudut (di luar bangun) dapat diseret masuk dan tepat menutup bangun → terlihat bangun = ½ persegi panjang.
- Pegangan pada titik potong diagonal: menggesernya di sepanjang diagonal mengubah belah ketupat ↔ layang-layang, luas tetap selama d₁ dan d₂ tetap.

#### S7 — Bangun Gabungan (M6)
- Bentuk komposit (contoh: denah rumah, taman dengan kolam).
- **Mode Pecah**: ketuk garis bantu untuk memotong menjadi bangun sederhana; setiap bagian diberi warna berbeda dan luasnya dijumlahkan di panel.
- **Mode Kurangi**: luas besar − luas lubang (kolam), divisualkan dengan animasi "mengangkat" bagian yang dikurangi.

#### S8 — Lingkaran: Juring Disusun Ulang (M7, Fase 2)
- Slider jumlah juring (4 → 32); juring tersusun bergantian hingga mendekati persegi panjang `πr × r`.

### 2.5 Spesifikasi animasi (Motion / Framer Motion + Tailwind)

| Kejadian | Animasi | Parameter |
|---|---|---|
| Potongan terlepas | Pegas | `type: "spring", stiffness: 300, damping: 22` |
| *Snap* ke target | Pegas cepat + skala 1 → 1,04 → 1 | `stiffness: 500, damping: 30` |
| Salah tempat | Kembali ke asal | pegas `stiffness: 200, damping: 20` |
| Highlight unsur | `strokeWidth` & cahaya (`filter: drop-shadow`) | 150 ms ease-out |
| Ganti langkah contoh | Geser + pudar | 250 ms; `AnimatePresence mode="wait"` |
| Angka luas berubah | Hitung naik (*count-up*) | 300 ms, dibulatkan per *frame* |
| Gandakan & putar | `rotate` 0 → 180 dengan `transformOrigin` di titik tengah sisi | 600 ms ease-in-out |
| Perpindahan halaman | Pudar + geser 8 px | 200 ms |

Aturan:
- Hanya menganimasikan `transform` dan `opacity` untuk elemen besar; atribut SVG `d`/`points` diubah lewat *motion values* agar tidak memicu *re-render* React tiap *frame*.
- Semua animasi dekoratif **dimatikan** bila `prefers-reduced-motion: reduce` (transformasi edukatif tetap ada, tetapi berupa langkah instan dengan pudar singkat).
- Seret memakai `drag` dari Motion dengan `dragMomentum={false}` di kanvas geometri agar presisi.

### 2.6 Logika geometri (`src/geometry/`)
Fungsi murni tanpa React, diuji dengan Vitest:
- `polygonArea(points)` — rumus *shoelace*.
- `perpendicularFoot(point, lineA, lineB)` — kaki garis tinggi.
- `splitPolygonByLine(polygon, line)` → `[pieceA, pieceB]`.
- `translate`, `rotate(points, angle, origin)`, `isCongruentPlacement(piece, target, tol)`.
- `snapToTarget(piece, targets, tol)`.
- Invarian yang wajib diuji: luas total sebelum = sesudah transformasi (selisih < 1e-9).

---

## 3. Latihan & Dukungan Literasi

### 3.1 Pembaca Soal (mengatasi EL01/EL05)
- Soal cerita tampil per kalimat; siswa **menyorot** frasa dan memilih label: *Diketahui*, *Ditanya*, *Tidak diperlukan*.
- Tabel *Diketahui/Ditanya* terisi otomatis dan tetap menempel (*sticky*) di atas area jawaban.
- Tombol **"Gambar situasinya"** membuka kanvas sketsa dengan bangun siap pakai (mendukung F2).
- Pada latihan, aplikasi memberi umpan balik bila informasi kunci belum disorot; **pada tes, alat ini tersedia tetapi tanpa umpan balik**.

### 3.2 Petunjuk Bertingkat
1. **Petunjuk 1 — Arah**: "Bangun apa yang kamu lihat?"
2. **Petunjuk 2 — Strategi**: "Garis mana yang tegak lurus alas?"
3. **Petunjuk 3 — Contoh**: membuka contoh mirip yang sudah dikerjakan.
Penggunaan petunjuk dicatat (data pendukung penelitian).

### 3.3 Umpan Balik Berbasis Miskonsepsi
| Jawaban siswa | Miskonsepsi | Pesan |
|---|---|---|
| a × sisi miring | Tinggi = sisi miring | "Tinggi harus tegak lurus alas. Coba ketuk garis oranye." |
| a × t tanpa ÷2 (segitiga) | Lupa setengah | "Segitiga adalah setengah dari jajar genjang. Lihat simulasi Gandakan & Putar." |
| Satuan cm untuk luas | Satuan luas | "Luas memakai satuan persegi: cm²." |
| Campur cm dan m | Konversi | "Samakan satuannya dulu." |
| Jawaban desimal untuk benda tidak terbagi | Interpretasi | "Bisakah membeli 1,83 lembar?" |

### 3.4 Bank Soal
- Setiap soal memiliki metadata: `modul`, `proses` (R/F/E/I), `konteks`, `level` (1–3), `kalkulator` (boleh/tidak), `isomorfikDengan`.
- **Soal mirip**: templat dengan parameter acak (dibatasi agar hasil bulat/wajar), mis. jajar genjang dengan tripel Pythagoras (3-4-5, 5-12-13, 6-8-10) agar sisi miring berbeda dari tinggi.

---

## 4. Evaluasi: Mesin Pretest–Posttest

### 4.1 Alur
```
Guru membuka tes (jadwal + paket) → Siswa login → Lembar petunjuk & persetujuan
→ Kerjakan (unit soal berurutan, bisa kembali dalam tes) → Tinjau jawaban → Kirim
→ Penilaian otomatis (PG/isian) + antrean rubrik (uraian) → Skor final → Ekspor
```

### 4.2 Aturan mode tes
- Pretest = **Paket A**, posttest = **Paket B** (paralel/isomorfik). Untuk uji kesetaraan paket, peneliti bisa memakai urutan *counterbalanced* pada kelompok uji coba.
- Tanpa petunjuk, tanpa umpan balik, tanpa akses ke modul belajar selama tes.
- Tersedia: kalkulator (bisa dimatikan guru), Pembaca Soal (tanpa umpan balik), kanvas sketsa.
- Timer 80 menit (dapat diatur); autosimpan setiap perubahan ke IndexedDB, sinkron tiap 15 detik bila online.
- Bila koneksi putus saat kirim → antre di *outbox*, dikirim ulang otomatis; siswa melihat status "Tersimpan di HP, menunggu sinyal".
- Kunci jawaban **tidak pernah** dikirim ke klien; penilaian otomatis dilakukan di server.

### 4.3 Penilaian
- **PG/isian numerik**: otomatis dengan toleransi (mis. ±0,01) dan kesetaraan satuan.
- **Uraian**: antarmuka rubrik — jawaban siswa (teks + sketsa) di kiri, rubrik butir (skor 0–4) di kanan; dukungan dua penilai buta (*blind*), perhitungan kesepakatan (persentase kesepakatan / Cohen's kappa).
- Skor dilaporkan: total (0–100), per proses (R, F, E, I), per butir.

---

## 5. Dasbor Guru/Peneliti
- **Kelas**: buat kelas, buat kode siswa massal (mis. `7A-01` … `7A-32`), cetak kartu kode.
- **Progres**: matriks siswa × modul (belum/sedang/selesai), rata-rata waktu di simulasi.
- **Miskonsepsi**: grafik batang miskonsepsi tersering dari umpan balik §3.3.
- **Hasil tes**: tabel pretest, posttest, N-gain per siswa; profil radar R/F/E/I kelas (pre vs post).
- **Ekspor**: CSV/XLSX (skor per butir, per proses, total, N-gain) + data mentah event (JSON Lines).

---

## 6. Backend & Analisis (Python)

### 6.1 API (FastAPI)
| Endpoint | Fungsi |
|---|---|
| `POST /auth/student` | Login kode kelas + kode siswa → token |
| `GET /content/version` | Versi konten untuk pembaruan cache PWA |
| `GET /tests/active` | Paket tes yang sedang dibuka untuk kelas |
| `PUT /attempts/{id}/responses` | Simpan/sinkron jawaban (idempoten) |
| `POST /attempts/{id}/submit` | Kirim tes |
| `GET/POST /scoring/queue` | Antrean penilaian rubrik |
| `POST /events/batch` | Event pembelajaran (anonim) |
| `GET /reports/class/{id}` | Ringkasan kelas |
| `GET /exports/class/{id}.xlsx` | Ekspor |

### 6.2 Model data inti
```
School ─< Class ─< Student(code, class_id)            -- tanpa nama asli
Test(id, kind: pre|post, package: A|B) ─< Item(id, unit, process, context, max_score, type)
Attempt(id, student_id, test_id, started_at, submitted_at, status)
Response(attempt_id, item_id, answer_json, sketch_svg, updated_at)
Score(response_id, rater_id, score, rubric_level, note)
ModuleProgress(student_id, module_id, step, completed_at)
Event(student_id, type, payload_json, ts)              -- mis. sim_cut, hint_open
```

### 6.3 Modul analisis (`services/api/app/analysis/` & `analysis/`)
- Validitas isi: **indeks Aiken's V** dari skor validator.
- Uji coba instrumen: validitas butir (korelasi *product moment* butir–total), **reliabilitas Cronbach's alpha**, tingkat kesukaran, daya pembeda.
- Efektivitas: **N-gain** = (posttest − pretest) / (skor maks − pretest); kategori Hake (≥ 0,7 tinggi; 0,3–0,7 sedang; < 0,3 rendah).
- Uji prasyarat & uji beda: normalitas (Shapiro–Wilk) → *paired t-test* atau Wilcoxon *signed-rank*; ukuran efek (Cohen's d).
- Kesepakatan antar-penilai: Cohen's kappa / ICC.
- Pustaka: `pandas`, `numpy`, `scipy`, `pingouin`, `openpyxl`.

---

## 7. PWA & Offline
- `vite-plugin-pwa` (Workbox): strategi *precache* untuk *shell* + konten modul; *stale-while-revalidate* untuk video thumbnail; video bisa diunduh per modul (tombol "Simpan untuk offline").
- `manifest.webmanifest`: `display: standalone`, `orientation: any`, ikon 192/512 + *maskable*, `theme_color` sesuai sistem desain.
- Komponen **"Pasang Aplikasi"** menangkap `beforeinstallprompt` (Android) dan menampilkan panduan "Bagikan → Tambahkan ke Layar Utama" untuk iOS.
- Pembaruan: *toast* "Versi baru tersedia — Muat ulang" (tidak memaksa saat tes berlangsung).

## 8. Identitas Visual (orisinal)
- Tema: **"Petualangan Potongan"** — peta pulau-pulau bangun datar; setiap modul adalah pulau, setiap simulasi yang selesai memberi "kepingan" yang melengkapi sebuah teka-teki tangram besar di beranda.
- Seluruh ilustrasi, karakter pemandu, dan logo **dibuat sendiri**; tidak memakai aset, karakter, logo, atau tipografi dari anime/merek mana pun.
- Tipografi: font sans-serif yang mudah dibaca dengan angka tabular (mis. *Plus Jakarta Sans* atau *Nunito*), ukuran dasar 16 px.
