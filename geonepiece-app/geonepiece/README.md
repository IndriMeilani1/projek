# GeOnePiece

PWA pembelajaran **Luas Bangun Datar** untuk siswa SMP, berbasis literasi matematika (OECD/PISA 2022).
Simulasi potong–geser–susun ulang, Diagram Venn keluarga segiempat, latihan soal cerita, serta instrumen pretest–posttest beserta penilaian rubrik dan N-gain.

## Menjalankan di VS Code

Prasyarat: **Node.js 20 atau lebih baru** (https://nodejs.org). Python 3.10+ hanya diperlukan untuk API & analisis (opsional).

```bash
cd apps/web
npm install
npm run dev          # buka http://localhost:5173 — atau alamat "Network" di HP (satu Wi-Fi)
```

Build & uji sebagai PWA (service worker hanya aktif pada hasil build):

```bash
npm run build
npm run preview      # buka http://localhost:4173 → menu browser → "Instal aplikasi"
npm run test         # tes unit (geometri, penskoran, token)
```

Folder `apps/web/dist/` hasil build bisa diunggah ke hosting statis apa pun (Netlify, Vercel, GitHub Pages, hosting kampus). **Pemasangan PWA di HP membutuhkan HTTPS.**

## Cara pakai singkat

| Peran | Langkah |
|---|---|
| Siswa | Masuk dengan **kode kelas + kode siswa** (tanpa nama/email) → Belajar (7 modul) · Lab · Latihan · Peta Segiempat |
| Guru (tes) | Buka **Mode Guru** (`#/guru`, PIN awal `2026` — segera ganti) → tab *Token Tes* → bacakan token hari itu ke kelas |
| Siswa (tes) | Beranda → Pretest/Posttest → masukkan token → kerjakan (tersimpan otomatis, bisa offline) → Kumpulkan → *Unduh file jawaban* |
| Guru (nilai) | *Kumpulkan Jawaban* (impor file .json siswa atau ambil dari API) → *Penilaian* (rubrik 0–4) → *Rekap & Ekspor* (CSV, N-gain) |
| Peneliti | `python analysis/scripts/analisis_literasi.py efektivitas skor_per_butir.csv` |

## Mode data

- **Mandiri (bawaan):** tanpa server. Jawaban disimpan di HP siswa, lalu dikumpulkan ke guru sebagai file `.json`.
- **Dengan API (opsional):** jalankan `services/api` dan isi `VITE_API_URL` di `apps/web/.env`. Jawaban dikirim otomatis ketika ada internet.

```bash
cd services/api
pip install -r requirements.txt
# Windows: set TEACHER_KEY=rahasia   |  Mac/Linux: export TEACHER_KEY=rahasia
uvicorn main:app --reload --port 8000
```

## Sebelum dipakai di sekolah
1. Ganti `VITE_TOKEN_SECRET` di `apps/web/.env` (salin dari `.env.example`).
2. Ganti PIN guru di Mode Guru → Pengaturan.
3. Kunci jawaban ikut terunduh di aplikasi. Untuk penelitian, gunakan Mode Guru di perangkat guru sendiri.
4. Validasi instrumen (`docs/INSTRUMEN_PRETEST_POSTTEST.md`) oleh ahli sebelum dipakai.

## Dokumen
| Dokumen | Isi |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Panduan konteks & aturan coding |
| [docs/PRD.md](docs/PRD.md) | Tujuan, pengguna, user stories, indikator literasi |
| [docs/RANCANGAN_FITUR.md](docs/RANCANGAN_FITUR.md) | Spesifikasi simulasi, animasi, tes, API |
| [docs/STRUKTUR_FOLDER.md](docs/STRUKTUR_FOLDER.md) | Struktur folder target |
| [docs/INSTRUMEN_PRETEST_POSTTEST.md](docs/INSTRUMEN_PRETEST_POSTTEST.md) | Kisi-kisi, soal, kunci, rubrik |

## Struktur kode (aktual)
```
apps/web/src/
├── main.jsx · app/ (App.jsx, Layout.jsx, router.jsx)
├── pages/              HomePage, LoginPage, LearnPages (Belajar/Modul/Lab/Peta), OtherPages (Latihan/Tes/Profil)
├── features/
│   ├── simulations/    canvas/ (GeoCanvas, highlight, Panels) · sims/ (6 simulasi) · registry.js
│   ├── venn/           QuadVenn.jsx — Diagram Venn keluarga segiempat
│   ├── learn/          ModuleFlow, WorkedExample, FormulaBuilder
│   ├── practice/       ProblemReader (Pembaca Soal), PracticeItem
│   ├── assessment/     TestRunner, Calculator, SketchPad, attempts, token, sync, scoring
│   ├── teacher/        TeacherDashboard
│   └── pwa/            InstallPrompt, OfflineBadge
├── content/            modules.js (M0–M6), tests.js (Paket A/B), keys.js (kunci & rubrik)
├── geometry/           fungsi geometri murni (diuji)
├── motion/             preset animasi Motion (Framer Motion)
├── components/ui/      Icon, ShapeIcon, Logo, Slider, Tabs, Feedback, …
├── stores/             session, progress (tersimpan di localStorage)
├── utils/              storage, format (angka id-ID), evaluate (kalkulator tanpa eval)
└── styles/index.css    Tailwind v4 + token warna semantik + keyframes
```
