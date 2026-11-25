"""
Analisis data penelitian GeOnePiece (untuk Bab III/IV skripsi).

Masukan = file CSV hasil ekspor Mode Guru ("Skor per butir (CSV)"), pemisah ';' dan koma desimal.

Contoh pemakaian:
  python analisis_literasi.py efektivitas skor_per_butir.csv
  python analisis_literasi.py butir       skor_uji_coba.csv --tes pretest
  python analisis_literasi.py aiken       validasi_ahli.csv --kategori 4

Keluaran ditulis ke layar dan ke folder ./hasil/ (CSV).

Format validasi_ahli.csv (untuk Aiken's V): baris = butir/aspek, kolom = validator, isi = skor 1..c
  butir;V1;V2;V3
  soal_1;4;4;3
"""
from __future__ import annotations

import argparse
import math
from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats

# 4 soal, masing-masing satu indikator literasi; skor per tahapan, maks 6 per soal.
ITEMS = ["soal_1", "soal_2", "soal_3", "soal_4"]
PROCESS = {"R": "Penalaran Matematis", "F": "Merumuskan", "E": "Menerapkan", "I": "Menafsirkan & Mengevaluasi"}
ITEM_PROCESS = {"R": ["soal_1"], "F": ["soal_2"], "E": ["soal_3"], "I": ["soal_4"]}
MAX_ITEM = 6
MAX_TOTAL = MAX_ITEM * len(ITEMS)  # 24 (skor mentah)
MAX_NILAI = 100  # nilai = skor / 24 * 100
OUT = Path("hasil")


def read_scores(path: str) -> pd.DataFrame:
    df = pd.read_csv(path, sep=";", decimal=",", dtype={"kode_siswa": str, "kode_kelas": str}, encoding="utf-8-sig")
    df.columns = [str(c).strip() for c in df.columns]
    for c in ITEMS + ["total", "nilai", "R", "F", "E", "I"]:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce")
    return df


def kategori_ngain(g: float) -> str:
    if pd.isna(g):
        return "-"
    return "Tinggi" if g >= 0.7 else "Sedang" if g >= 0.3 else "Rendah"


# ---------------------------------------------------------------- efektivitas
def efektivitas(path: str) -> None:
    df = read_scores(path)
    lengkap = df.dropna(subset=ITEMS)
    if len(lengkap) < len(df):
        print(f"[!] {len(df) - len(lengkap)} lembar jawaban belum dinilai lengkap dan diabaikan.")
    pre = lengkap[lengkap.tes == "pretest"].set_index(["kode_kelas", "kode_siswa"])
    post = lengkap[lengkap.tes == "posttest"].set_index(["kode_kelas", "kode_siswa"])
    pair = pre.join(post, lsuffix="_pre", rsuffix="_post", how="inner")
    n = len(pair)
    print(f"\n=== EFEKTIVITAS (n berpasangan = {n}) ===")
    if n < 3:
        print("Data berpasangan terlalu sedikit untuk analisis.")
        return

    # Analisis memakai nilai 0–100 (N-gain tidak berubah karena skalanya proporsional).
    pair["nilai_pre"] = pair["total_pre"] / MAX_TOTAL * MAX_NILAI
    pair["nilai_post"] = pair["total_post"] / MAX_TOTAL * MAX_NILAI
    x, y = pair["nilai_pre"].to_numpy(float), pair["nilai_post"].to_numpy(float)
    pair["n_gain"] = [(b - a) / (MAX_NILAI - a) if a < MAX_NILAI else np.nan for a, b in zip(x, y)]
    pair["kategori"] = pair["n_gain"].map(kategori_ngain)

    desk = pd.DataFrame(
        {
            "Pretest": [x.mean(), x.std(ddof=1), x.min(), x.max()],
            "Posttest": [y.mean(), y.std(ddof=1), y.min(), y.max()],
        },
        index=["rata-rata", "simpangan baku", "minimum", "maksimum"],
    ).round(2)
    print("\nStatistik deskriptif (nilai 0–100):\n", desk)

    g_mean = pair["n_gain"].mean()
    print(f"\nRata-rata N-gain = {g_mean:.3f} ({kategori_ngain(g_mean)})")
    print("Sebaran kategori:\n", pair["kategori"].value_counts().to_string())

    d = y - x
    sw = stats.shapiro(d)
    print(f"\nUji normalitas selisih (Shapiro–Wilk): W = {sw.statistic:.3f}, p = {sw.pvalue:.4f}")
    if sw.pvalue > 0.05:
        t = stats.ttest_rel(y, x)
        dz = d.mean() / d.std(ddof=1)
        print(f"Data normal → uji-t berpasangan: t({n - 1}) = {t.statistic:.3f}, p = {t.pvalue:.4g}; ukuran efek Cohen's dz = {dz:.2f}")
    else:
        w = stats.wilcoxon(y, x)
        z = stats.norm.isf(w.pvalue / 2)
        r = z / math.sqrt(n)
        print(f"Data tidak normal → Wilcoxon signed-rank: W = {w.statistic:.1f}, p = {w.pvalue:.4g}; ukuran efek r = {r:.2f}")

    rows = []
    for k, nama in PROCESS.items():
        items_k = ITEM_PROCESS[k]
        mx = MAX_ITEM * len(items_k)
        a, b = pair[f"{k}_pre"].mean(), pair[f"{k}_post"].mean()
        rows.append({"proses": nama, "pre_%": round(a / mx * 100, 1), "post_%": round(b / mx * 100, 1), "n_gain": round((b - a) / (mx - a), 3) if a < mx else np.nan})
    proc = pd.DataFrame(rows)
    print("\nCapaian per proses literasi:\n", proc.to_string(index=False))

    OUT.mkdir(exist_ok=True)
    pair.reset_index()[["kode_kelas", "kode_siswa", "total_pre", "total_post", "nilai_pre", "nilai_post", "n_gain", "kategori"]].to_csv(OUT / "ngain_per_siswa.csv", sep=";", decimal=",", index=False)
    proc.to_csv(OUT / "ngain_per_proses.csv", sep=";", decimal=",", index=False)
    print(f"\nTersimpan: {OUT/'ngain_per_siswa.csv'}, {OUT/'ngain_per_proses.csv'}")


# ---------------------------------------------------------------- analisis butir (uji coba)
def butir(path: str, tes: str) -> None:
    df = read_scores(path)
    df = df[df.tes == tes].dropna(subset=ITEMS)
    n = len(df)
    print(f"\n=== ANALISIS BUTIR ({tes}, n = {n}) ===")
    if n < 5:
        print("Data uji coba terlalu sedikit.")
        return
    X = df[ITEMS].to_numpy(float)
    total = X.sum(axis=1)

    # r tabel product moment (dua sisi, α = 0,05)
    tcrit = stats.t.ppf(0.975, n - 2)
    r_tab = tcrit / math.sqrt(n - 2 + tcrit**2)

    # Cronbach's alpha
    k = X.shape[1]
    alpha = k / (k - 1) * (1 - X.var(axis=0, ddof=1).sum() / total.var(ddof=1))

    # Kelompok atas/bawah 27%
    m = max(1, round(0.27 * n))
    order = np.argsort(total)
    low, high = X[order[:m]], X[order[-m:]]

    rows = []
    for j, it in enumerate(ITEMS):
        r = np.corrcoef(X[:, j], total)[0, 1] if X[:, j].std() > 0 else np.nan
        p = X[:, j].mean() / MAX_ITEM
        dp = (high[:, j].mean() - low[:, j].mean()) / MAX_ITEM
        rows.append(
            {
                "butir": it,
                "r_hitung": round(r, 3),
                "valid": "Valid" if r > r_tab else "Tidak valid",
                "kesukaran_P": round(p, 2),
                "kategori_P": "Sukar" if p <= 0.30 else "Sedang" if p <= 0.70 else "Mudah",
                "daya_pembeda": round(dp, 2),
                "kategori_DP": "Sangat baik" if dp >= 0.40 else "Baik" if dp >= 0.30 else "Cukup (revisi)" if dp >= 0.20 else "Jelek",
            }
        )
    res = pd.DataFrame(rows)
    print(f"r tabel (n = {n}, α = 0,05) = {r_tab:.3f}")
    print(res.to_string(index=False))
    print(f"\nReliabilitas Cronbach's alpha = {alpha:.3f} ({'reliabel' if alpha >= 0.70 else 'belum reliabel'}; kriteria ≥ 0,70)")
    OUT.mkdir(exist_ok=True)
    res.to_csv(OUT / f"analisis_butir_{tes}.csv", sep=";", decimal=",", index=False)
    print(f"Tersimpan: {OUT / f'analisis_butir_{tes}.csv'}")


# ---------------------------------------------------------------- Aiken's V
def aiken(path: str, c: int) -> None:
    df = pd.read_csv(path, sep=";", decimal=",", encoding="utf-8-sig")
    key = df.columns[0]
    raters = df.columns[1:]
    n = len(raters)
    lo = 1
    df["V"] = ((df[raters] - lo).sum(axis=1) / (n * (c - 1))).round(3)
    print(f"\n=== AIKEN'S V (validator = {n}, kategori = {c}) ===")
    print(df[[key, *raters, "V"]].to_string(index=False))
    print("\nBandingkan setiap V dengan nilai kritis tabel Aiken untuk", n, "validator dan", c, "kategori.")
    OUT.mkdir(exist_ok=True)
    df.to_csv(OUT / "aiken_v.csv", sep=";", decimal=",", index=False)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Analisis data penelitian GeOnePiece")
    sub = ap.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("efektivitas", help="N-gain, uji normalitas, uji beda, per proses literasi")
    a.add_argument("csv")
    b = sub.add_parser("butir", help="Validitas, reliabilitas, kesukaran, daya pembeda (uji coba)")
    b.add_argument("csv")
    b.add_argument("--tes", default="pretest", choices=["pretest", "posttest"])
    c = sub.add_parser("aiken", help="Indeks Aiken's V dari lembar validasi ahli")
    c.add_argument("csv")
    c.add_argument("--kategori", type=int, default=4)
    args = ap.parse_args()
    if args.cmd == "efektivitas":
        efektivitas(args.csv)
    elif args.cmd == "butir":
        butir(args.csv, args.tes)
    else:
        aiken(args.csv, args.kategori)
