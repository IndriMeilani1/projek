/*
 * Kerangka Rigorous Mathematical Thinking (RMT) — Kinard & Kozulin (2008).
 * Alur latihan mengikuti fase fungsi kognitif Feuerstein (Input → Elaborasi → Output)
 * dan elemen Learning Activity (analisis tugas → perencanaan → refleksi).
 * Pertanyaan mediasi memuat tiga kriteria MLE: intensionalitas, makna, transendensi.
 * Pertanyaan bawaan ini dipakai bila Tutor AI tidak aktif/offline.
 */

export const RMT_PHASES = [
  {
    id: 'analisis',
    no: 1,
    label: 'Analisis',
    phase: 'Input',
    icon: 'highlighter',
    goal: 'Kumpulkan informasi dengan teliti: apa yang diketahui, apa yang ditanya, dan apa yang tidak diperlukan.',
    functions: ['Persepsi yang jelas', 'Ketepatan data & satuan', 'Memilah informasi relevan'],
    questions: [
      'Bangun apa yang dibicarakan dalam soal ini?',
      'Ukuran apa saja yang diketahui? Apa satuannya?',
      'Apa tepatnya yang ditanyakan?',
      'Adakah informasi yang tidak diperlukan untuk menjawab?',
    ],
  },
  {
    id: 'eksplorasi',
    no: 2,
    label: 'Eksplorasi',
    phase: 'Elaborasi',
    icon: 'map',
    goal: 'Hubungkan informasi dengan konsep: pilih rumus, jelaskan alasannya, dan susun rencana langkah sebelum menghitung.',
    functions: ['Hubungan bagian–keseluruhan', 'Membandingkan & memilih strategi', 'Merencanakan, bukan coba-coba'],
    questions: [
      'Bangun ini bisa diubah menjadi bangun apa yang sudah kamu kenal luasnya?',
      'Rumus apa yang cocok, dan mengapa rumus itu berlaku di sini?',
      'Mana yang menjadi alas dan mana tingginya? Apakah tingginya tegak lurus alas?',
      'Apakah satuannya sudah sama? Kalau belum, apa yang harus diubah dulu?',
    ],
  },
  {
    id: 'jawab',
    no: 3,
    label: 'Jawab',
    phase: 'Output',
    icon: 'pencil',
    goal: 'Jalankan rencanamu dengan tepat, lalu tuliskan jawaban yang jelas lengkap dengan satuannya.',
    functions: ['Perhitungan akurat', 'Komunikasi jelas & presisi', 'Satuan yang benar'],
    questions: [
      'Apakah setiap angka sudah dimasukkan ke tempat yang benar dalam rumus?',
      'Apakah hasilnya masuk akal untuk benda/tempat di soal?',
      'Satuan apa yang tepat untuk luas: cm, m, atau cm²/m²?',
    ],
  },
  {
    id: 'refleksi',
    no: 4,
    label: 'Refleksi',
    phase: 'Metakognisi',
    icon: 'eye',
    goal: 'Periksa kembali caramu dan temukan aturan umum yang bisa dipakai di soal lain.',
    functions: ['Memantau & menilai strategi sendiri', 'Transendensi: aturan umum', 'Makna bagi kehidupan'],
    questions: [
      'Langkah mana yang paling menentukan jawabanmu? Mengapa?',
      'Kalau ukurannya diubah, bagian mana dari caramu yang tetap sama?',
      'Di mana lagi dalam kehidupan sehari-hari kamu bisa memakai cara ini?',
    ],
  },
];

export const RMT_PHASE_IDS = RMT_PHASES.map((p) => p.id);
export const getPhase = (id) => RMT_PHASES.find((p) => p.id === id) ?? RMT_PHASES[0];

/** Kalimat-kalimat UI Tutor RMT. */
export const TUTOR_TEXT = {
  title: 'Tutor RMT',
  intro: 'Aku tidak akan memberi jawaban akhir. Aku akan bertanya supaya kamu menemukannya sendiri. Ceritakan sampai mana pikiranmu!',
  privacy: 'Pesanmu dikirim ke layanan AI (Groq). Jangan menulis nama, alamat, atau data pribadi.',
  offline: 'Tutor AI belum aktif atau sedang offline. Pakai pertanyaan penuntun di bawah ini dulu, ya.',
  busy: 'Tutor sedang ramai dipakai. Tunggu sebentar lalu coba lagi. Sementara itu, jawab pertanyaan penuntun di bawah.',
  error: 'Tutor tidak dapat dihubungi. Coba lagi nanti, atau pakai pertanyaan penuntun di bawah.',
  placeholder: 'Tulis pikiranmu atau pertanyaanmu…',
  limit: 'Kamu sudah banyak berdiskusi di soal ini. Coba selesaikan dulu dengan langkahmu sendiri, ya!',
  cooldown: 'Tunggu beberapa detik sebelum mengirim lagi.',
};
