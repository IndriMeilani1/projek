# Struktur Folder Proyek — GeOnePiece

Monorepo sederhana: satu repositori berisi aplikasi web (PWA), API Python, konten bersama, dan skrip analisis penelitian.

```
geonepiece/
├── CLAUDE.md                     # Panduan konteks & aturan coding untuk AI/developer
├── README.md                     # Cara menjalankan proyek
├── .editorconfig
├── .gitignore
├── .env.example                  # Contoh variabel lingkungan (tanpa rahasia)
├── package.json                  # npm workspaces: ["apps/*"]
│
├── docs/                         # Semua dokumen perencanaan & penelitian
│   ├── PRD.md
│   ├── RANCANGAN_FITUR.md
│   ├── STRUKTUR_FOLDER.md
│   ├── INSTRUMEN_PRETEST_POSTTEST.md
│   ├── adr/                      # Architecture Decision Records (0001-pakai-motion.md, …)
│   ├── design/                   # Wireframe, palet warna, aset sumber (Figma export)
│   └── penelitian/               # Lembar validasi ahli, angket, surat izin (tanpa data pribadi)
│
├── content/                      # Konten bersama (sumber kebenaran tunggal), dibaca web & API
│   ├── modules/                  # m0-konsep-luas.json … m6-gabungan.json
│   ├── items/
│   │   ├── practice/             # Bank soal latihan + templat soal mirip
│   │   └── tests/                # paket-a.json, paket-b.json (TANPA kunci jawaban)
│   ├── keys/                     # Kunci & rubrik tes — HANYA dibaca API, tidak dibundel ke web
│   ├── misconceptions.json       # Pemetaan jawaban salah → pesan umpan balik
│   └── schema/                   # JSON Schema untuk validasi konten
│
├── apps/
│   └── web/                      # React + Vite + JavaScript (PWA)
│       ├── index.html
│       ├── package.json
│       ├── vite.config.js        # termasuk vite-plugin-pwa
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       ├── jsconfig.json         # alias "@/…" → src/
│       ├── eslint.config.js
│       ├── public/
│       │   ├── icons/            # icon-192.png, icon-512.png, maskable-512.png
│       │   ├── videos/           # (opsional) video kecil; video besar via CDN
│       │   └── robots.txt
│       ├── src/
│       │   ├── main.jsx
│       │   ├── app/
│       │   │   ├── App.jsx
│       │   │   ├── router.jsx            # react-router: rute siswa & /guru
│       │   │   └── providers.jsx         # MotionConfig, QueryClient, dll.
│       │   ├── pages/                    # Satu file per rute (tipis, merangkai fitur)
│       │   │   ├── HomePage.jsx
│       │   │   ├── ModulePage.jsx
│       │   │   ├── LabPage.jsx
│       │   │   ├── PracticePage.jsx
│       │   │   ├── TestPage.jsx
│       │   │   ├── ProfilePage.jsx
│       │   │   └── teacher/              # DashboardPage, ScoringPage, ExportPage
│       │   ├── features/                 # Logika per domain (komponen + hooks + store)
│       │   │   ├── auth/
│       │   │   ├── learn/                # ModuleFlow, WorkedExamplePlayer, FormulaBuilder
│       │   │   ├── simulations/
│       │   │   │   ├── canvas/           # GeoCanvas, Grid, Handle, MeasurePanel, LiveFormula
│       │   │   │   ├── highlight/        # useHighlight, HighlightContext (S0)
│       │   │   │   ├── unit-grid/        # S1
│       │   │   │   ├── parallelogram-cut/# S2 ⭐
│       │   │   │   ├── base-height/      # S3
│       │   │   │   ├── triangle-shear/   # S4
│       │   │   │   ├── trapezoid-twin/   # S5
│       │   │   │   ├── kite-rhombus/     # S6
│       │   │   │   ├── composite/        # S7
│       │   │   │   └── circle-sectors/   # S8 (fase 2)
│       │   │   ├── problem-reader/       # Pembaca Soal
│       │   │   ├── practice/             # Latihan, petunjuk bertingkat, soal mirip
│       │   │   ├── assessment/           # Mesin tes, timer, autosave, outbox
│       │   │   ├── teacher/              # Dasbor, rubrik, ekspor
│       │   │   └── pwa/                  # InstallPrompt, UpdateToast, OfflineBadge
│       │   ├── geometry/                 # Fungsi MURNI: area, transform, split, snap (+ tes)
│       │   │   ├── area.js
│       │   │   ├── transform.js
│       │   │   ├── split.js
│       │   │   ├── snap.js
│       │   │   └── __tests__/
│       │   ├── motion/                   # Preset animasi bersama (springs.js, variants.js)
│       │   ├── components/
│       │   │   └── ui/                   # Button, Card, Slider, Sheet, Toast, ProgressBar…
│       │   ├── content/                  # Loader konten (impor dari /content via alias)
│       │   ├── services/
│       │   │   ├── api.js                # fetch wrapper + token
│       │   │   ├── db.js                 # Dexie (IndexedDB): progress, responses, outbox
│       │   │   └── sync.js               # Sinkronisasi outbox saat online
│       │   ├── stores/                   # Zustand: sessionStore, settingsStore
│       │   ├── hooks/                    # useOnlineStatus, useReducedMotion, useDragSnap…
│       │   ├── utils/                    # format angka id-ID, satuan, konversi
│       │   ├── styles/
│       │   │   └── index.css             # @tailwind + token warna semantik
│       │   └── assets/                   # Ilustrasi orisinal (SVG)
│       └── tests/
│           ├── unit/                     # Vitest + Testing Library
│           └── e2e/                      # Playwright (alur tes offline, simulasi S2)
│
├── services/
│   └── api/                      # Python + FastAPI
│       ├── pyproject.toml
│       ├── alembic/              # Migrasi database
│       ├── app/
│       │   ├── main.py
│       │   ├── config.py
│       │   ├── db.py             # SQLAlchemy (SQLite saat pengembangan, PostgreSQL saat produksi)
│       │   ├── models/           # school.py, student.py, test.py, attempt.py, event.py
│       │   ├── schemas/          # Pydantic
│       │   ├── routers/          # auth.py, content.py, tests.py, attempts.py, scoring.py, reports.py
│       │   ├── services/         # autoscore.py, rubric.py, export.py
│       │   └── analysis/         # ngain.py, item_analysis.py, aiken.py, reliability.py, stats.py
│       └── tests/                # pytest
│
├── analysis/                     # Analisis penelitian (di luar aplikasi)
│   ├── notebooks/                # 01_validasi_ahli.ipynb, 02_uji_coba_instrumen.ipynb, 03_efektivitas.ipynb
│   ├── scripts/                  # run_ngain.py, item_analysis.py
│   ├── data/
│   │   ├── raw/                  # (di-.gitignore) ekspor mentah
│   │   └── processed/            # (di-.gitignore)
│   └── reports/                  # Tabel/grafik untuk Bab IV
│
└── .github/
    └── workflows/
        └── ci.yml                # lint + tes web & api
```

## Konvensi Penamaan
| Jenis | Konvensi | Contoh |
|---|---|---|
| Komponen React | PascalCase `.jsx` | `ParallelogramCut.jsx` |
| Hook | camelCase berawalan `use` | `useDragSnap.js` |
| Fungsi/utilitas | camelCase `.js` | `polygonArea` di `area.js` |
| Folder fitur | kebab-case | `parallelogram-cut/` |
| File konten | kebab-case `.json`, berawalan kode | `m2-jajar-genjang.json` |
| ID soal tes | `{paket}{unit}.{nomor}` | `A2.1`, `B4.2` |
| Python | snake_case | `item_analysis.py` |

## Isi Standar Satu Folder Simulasi
```
features/simulations/parallelogram-cut/
├── ParallelogramCut.jsx        # Komponen utama (UI + interaksi)
├── useParallelogramCut.js      # State & logika interaksi (memanggil src/geometry)
├── steps.js                    # Skenario langkah terpandu untuk modul
├── ParallelogramCut.test.jsx
└── index.js                    # export publik
```
