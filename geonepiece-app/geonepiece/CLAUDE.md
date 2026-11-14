# CLAUDE.md — Panduan Konteks & Aturan Coding GeOnePiece

File ini dibaca oleh asisten AI (Claude Code) dan developer sebelum menulis kode. Ikuti aturan di sini kecuali pemilik proyek memberi instruksi lain secara eksplisit.

## 1. Konteks Proyek
- **Apa:** PWA pembelajaran *Luas Bangun Datar* untuk siswa SMP (Fase D) yang menumbuhkan **literasi matematika (kerangka OECD/PISA 2022)** melalui manipulasi visual (potong–geser–susun ulang) dan masalah kontekstual.
- **Untuk siapa:** siswa 12–15 tahun dengan HP Android kelas menengah ke bawah, sering offline; guru; peneliti (skripsi S1 Pendidikan Matematika Untirta).
- **Dasar desain:** *Cognitive Load Theory* — kurangi beban ekstrinsik (label di dalam gambar, *signaling*, langkah dikendalikan siswa), kelola beban intrinsik (rumus diturunkan dari persegi panjang), dorong beban germane (prediksi, penjelasan diri, soal mirip).
- **Dokumen acuan (baca sebelum mengerjakan fitur terkait):**
  - `docs/PRD.md` — tujuan, user stories, indikator literasi
  - `docs/RANCANGAN_FITUR.md` — spesifikasi simulasi, animasi, tes, API
  - `docs/STRUKTUR_FOLDER.md` — letak file
  - `docs/INSTRUMEN_PRETEST_POSTTEST.md` — butir tes, kunci, rubrik

## 2. Tech Stack
| Lapisan | Pilihan |
|---|---|
| Frontend | React 18+/19, Vite, **JavaScript** (ESM) + JSDoc untuk tipe |
| Styling | Tailwind CSS; token warna semantik di `src/styles/index.css` |
| Animasi | **Motion** (penerus Framer Motion; impor dari `motion/react`) |
| Routing / State | Router hash sendiri (`src/app/router.jsx`) · store kecil `createStore` + `useSyncExternalStore` (tersimpan di localStorage). Pindah ke react-router/Zustand bila aplikasi membesar. |
| Offline | `vite-plugin-pwa` (Workbox) · localStorage (MVP). Pertimbangkan IndexedDB (Dexie) bila sketsa jawaban membesar. |
| Matematika | Rumus dirender dengan komponen `LiveFormula` (tanpa KaTeX); geometri ditulis sendiri di `src/geometry/` |
| Tes | Vitest (`apps/web/tests/`) · Playwright (e2e, rencana) |
| Backend | Python 3.10+, FastAPI, Pydantic, SQLite stdlib (`services/api/main.py`) — opsional |
| Analisis | pandas, numpy, scipy, pingouin, openpyxl |

Jangan menambah dependensi baru tanpa alasan yang ditulis di `docs/adr/`.

## 3. Perintah
```bash
# Web
cd apps/web
npm install
npm run dev          # server dev
npm run build        # build produksi + service worker
npm run preview      # uji PWA hasil build (service worker hanya aktif di sini)
npm run test         # Vitest

# API (opsional)
cd services/api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Analisis penelitian
python analysis/scripts/analisis_literasi.py efektivitas skor_per_butir.csv
```

## 4. Aturan Kode Umum
- Komponen fungsi + hooks saja. Satu komponen per file; file > 250 baris → pecah.
- **Identifier dan komentar kode dalam bahasa Inggris; semua teks UI dalam Bahasa Indonesia** dan disimpan di konten/konstanta, bukan disebar di JSX bila dipakai ulang.
- Gunakan alias `@/` untuk impor dari `src/`.
- Format angka dengan `Intl.NumberFormat('id-ID')` (koma desimal: `1,83`; pemisah ribuan: `2.375.000`).
- Halaman (`pages/`) tipis; logika ada di `features/`. Logika matematika **tidak boleh** berada di komponen — taruh di `src/geometry/` atau `src/utils/`.
- Jangan menyimpan kunci jawaban tes di bundel frontend. Folder `content/keys/` hanya dibaca API.

## 5. Aturan Geometri (`src/geometry/`)
- Fungsi **murni**, tanpa React/DOM, input–output berupa array titik `{x, y}` dalam **satuan dunia** (1 = 1 petak).
- Konversi dunia ↔ piksel hanya di `GeoCanvas`.
- Setiap transformasi harus mempertahankan luas — wajib ada tes invarian: `|luasSebelum − luasSesudah| < 1e-9`.
- Toleransi bernama dan terpusat: `SNAP_TOLERANCE_PX = 16`, `RIGHT_ANGLE_TOLERANCE_DEG = 3`.
- Tinggi selalu dihitung sebagai jarak tegak lurus ke garis alas (bukan panjang sisi).

## 6. Aturan Simulasi & Interaktivitas
- Rangkaian SVG, bukan Canvas 2D, agar unsur bisa diketuk, disorot, dan diakses pembaca layar.
- Setiap unsur yang bisa disorot punya `data-element="base|height|side|diagonal|piece"` dan terdaftar di `HighlightContext`. Sorotan bersifat **dua arah** (gambar ↔ rumus).
- **Label dan garis tinggi berada di dalam/menempel pada gambar** — jangan meletakkan keterangan terpisah jauh dari bangunnya (temuan EL03).
- Warna semantik WAJIB konsisten: alas `--c-base` (biru), tinggi `--c-height` (oranye, putus-putus + tanda siku), diagonal `--c-diagonal` (ungu, titik-titik), potongan `--c-piece` (hijau, arsir), sisi miring `--c-side` (abu). Jangan pernah membedakan unsur hanya dengan warna.
- Target sentuh ≥ 44 px; pegangan titik terlihat 28 px dengan area sentuh 48 px.
- Interaksi seret memakai *pointer events* (mendukung jari, mouse, stylus); set `touch-action: none` pada kanvas.
- Langkah terpandu selalu dikendalikan siswa (tombol "Lanjut"); tidak ada auto-play yang tidak bisa dijeda.

## 7. Aturan Animasi (Motion + Tailwind)
- Pakai preset dari `src/motion/springs.js` dan `variants.js`; jangan menulis angka pegas baru di komponen.
  ```js
  export const springs = {
    detach: { type: 'spring', stiffness: 300, damping: 22 },
    snap:   { type: 'spring', stiffness: 500, damping: 30 },
    return: { type: 'spring', stiffness: 200, damping: 20 },
  };
  ```
- Animasikan hanya `transform` dan `opacity` untuk elemen besar. Untuk bentuk SVG yang berubah tiap *frame* (slider alas/tinggi), gunakan `useMotionValue`/`useTransform` agar **tidak** memicu *re-render* React per *frame*.
- Bungkus aplikasi dengan `<MotionConfig reducedMotion="user">`. Bila pengguna memilih gerak dikurangi: animasi dekoratif mati; transformasi edukatif tetap ditampilkan sebagai perubahan langkah dengan pudar ≤ 150 ms.
- Durasi: mikro-interaksi 150–250 ms; transformasi edukatif 400–800 ms; tidak ada animasi > 1 detik tanpa kendali pengguna.
- Target 60 fps; uji di profil *CPU throttling 4×* Chrome DevTools sebelum PR digabung.

## 8. Aturan Konten & Matematika
- Semua konten (modul, soal, petunjuk) ada di `/content` sebagai JSON yang divalidasi `content/schema/`.
- Rumus ditulis dengan KaTeX: `L = a \times t`, `L = \tfrac{1}{2} \times a \times t`, `L = \tfrac{(a+b)}{2} \times t`, `L = \tfrac{d_1 \times d_2}{2}`.
- Istilah baku: *alas, tinggi, sisi sejajar, diagonal, satuan luas (cm², m²), jajar genjang, belah ketupat, layang-layang, trapesium*.
- Setiap soal wajib punya metadata `process` (`R|F|E|I`), `context` (`personal|occupational|societal|scientific`), `level`, dan kunci yang sudah dicek dengan perhitungan.
- Jangan mengubah butir tes di `content/items/tests/` tanpa memperbarui kunci, rubrik, dan `docs/INSTRUMEN_PRETEST_POSTTEST.md` — butir tes adalah instrumen penelitian yang sudah divalidasi.

## 9. Aturan Mode Tes
- Mode tes: tanpa petunjuk, tanpa umpan balik, tanpa navigasi ke modul belajar.
- Autosimpan setiap perubahan ke IndexedDB; sinkron via *outbox* idempoten (`PUT` dengan `updated_at`).
- Jangan menampilkan *toast* pembaruan PWA dan jangan memuat ulang halaman saat tes berlangsung.
- Penilaian otomatis dilakukan di server.

## 10. Privasi & Etika (pengguna di bawah umur)
- Tidak mengumpulkan nama asli, email, nomor HP, foto, lokasi, atau rekaman suara siswa ke server tanpa persetujuan tertulis. Identitas = kode siswa.
- Event analitik hanya berisi kode siswa, tipe event, dan payload non-pribadi.
- Data mentah penelitian (`analysis/data/`) tidak pernah di-*commit*.

## 11. Aset & Hak Cipta
- Semua ilustrasi, ikon karakter, dan logo **orisinal**. Dilarang memakai karakter, logo, font, musik, atau gambar dari anime/merek mana pun (termasuk yang namanya mirip "One Piece"). Ikon UI dari pustaka berlisensi bebas (mis. Lucide).
- Video pembelajaran dibuat sendiri atau berlisensi jelas; cantumkan sumber di `docs/design/CREDITS.md`.

## 12. Pengujian & Definition of Done
Sebuah fitur selesai jika:
- [ ] Sesuai user story & AC di PRD
- [ ] Tes unit untuk logika (geometri wajib) lolos; simulasi utama punya tes e2e
- [ ] Berfungsi offline (cek di `npm run preview` → DevTools → Offline)
- [ ] Lolos cek aksesibilitas (target sentuh, kontras, `prefers-reduced-motion`, label ARIA pada pegangan)
- [ ] Mulus di layar 360 px dan di CPU *throttling* 4×
- [ ] Teks UI Bahasa Indonesia sudah diperiksa
- [ ] Lint bersih

## 13. Git
- Cabang: `feat/…`, `fix/…`, `content/…`, `docs/…`.
- Pesan commit gaya *Conventional Commits*: `feat(sim-s2): snap potongan segitiga ke target`.

## 14. Yang Harus Ditanyakan Dulu (jangan diasumsikan)
- Perubahan pada butir tes, kunci, atau rubrik.
- Penambahan pengumpulan data siswa jenis baru.
- Penambahan dependensi besar atau perubahan arsitektur offline.
