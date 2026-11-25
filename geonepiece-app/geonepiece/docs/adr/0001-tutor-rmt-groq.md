# ADR 0001 — Tutor RMT berbasis Groq (`groq-sdk`)

**Status:** diterima · **Tanggal:** 2026-11-25

## Konteks
Pemilik proyek meminta tutor AI yang menerapkan model *Rigorous Mathematical Thinking* (RMT; Kinard & Kozulin) untuk siswa SMP (12–15 tahun). Tutor harus memandu dengan pertanyaan penuntun dan **tidak boleh memberi jawaban akhir**.

Gemini API sempat dipertimbangkan, tetapi ketentuannya (23 Maret 2026) melarang aplikasi yang "directed towards or is likely to be accessed by individuals under the age of 18". Tier gratisnya juga memakai data untuk melatih produk dan bisa dibaca peninjau manusia.

Ketentuan Groq (Services Agreement, dibaca 25 November 2026):
- Pemilik akun harus berusia 18 tahun ke atas.
- Aplikasi yang diakses anak di bawah umur diperbolehkan, dengan tanggung jawab kepatuhan pada pelanggan (§6.3).
- Groq tidak boleh memakai input/output untuk melatih model (§4.2).

## Keputusan
- Menambah dependensi `groq-sdk@1.6.0` (versi dipatok). SDK dimuat secara *lazy* hanya saat Tutor dibuka.
- Model default `openai/gpt-oss-20b`: model open-weight tercepat yang berstatus *production* di Groq. Llama 3.1/3.3 sudah dihentikan untuk tier gratis per 16 Agustus 2026. Model bisa diganti lewat `VITE_GROQ_MODEL`.
- Kunci dibaca dari kunci yang disimpan di perangkat (Mode Guru → Pengaturan); bila tidak ada, dari `VITE_GROQ_API_KEY`.

## Konsekuensi & mitigasi
- **Kunci terbuka di browser.** SDK dijalankan dengan `dangerouslyAllowBrowser: true`, dan nilai `VITE_*` tertanam di bundel. Mitigasi:
  - kosongkan `VITE_GROQ_API_KEY` pada build publik;
  - pakai kunci khusus penelitian;
  - ganti kunci setelah penelitian.
  - Solusi jangka panjang: teruskan permintaan lewat `services/api` (proxy) agar kunci tetap di server.
- **Kuota gratis dipakai bersama satu kelas (±30 permintaan/menit).** Mitigasi:
  - jeda 6 detik antarpesan dan maksimal 12 pesan per soal;
  - pesan "Tutor sedang ramai" bila terkena batas;
  - pertanyaan penuntun bawaan tetap tersedia (juga saat offline).
- **Jawaban bocor.** Selain larangan di prompt sistem, setiap balasan disaring `maskAnswer()` (`src/utils/answerGuard.js`) sebelum ditampilkan bila soal belum terjawab.
- **Privasi.**
  - Yang dikirim hanya teks soal dan pekerjaan siswa; tanpa kode siswa atau kelas.
  - Siswa diingatkan agar tidak menulis data pribadi.
  - Persetujuan orang tua/sekolah untuk pemakaian AI menjadi tanggung jawab peneliti.
- **Mode tes tidak berubah.** Tutor tidak tersedia saat pretest/posttest (CLAUDE.md §9).
