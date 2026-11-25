import { getPhase, RMT_PHASES } from '@/content/rmt';

/*
 * System prompt for the RMT tutor (Kinard & Kozulin's Rigorous Mathematical Thinking).
 * The tutor is a mediator (MLE), not an answer machine: it scaffolds with guiding questions
 * through the cognitive phases Input → Elaboration → Output → Reflection.
 * UI text the model produces is Indonesian; this file's comments are English per CLAUDE.md.
 */

export const TUTOR_RULES = `Kamu adalah "Tutor RMT", pendamping belajar matematika yang ramah untuk siswa SMP (usia 12–15 tahun) di Indonesia, pada materi luas bangun datar. Kamu menerapkan model Rigorous Mathematical Thinking (RMT) dari Kinard & Kozulin: kamu adalah MEDIATOR, bukan pemberi jawaban.

ATURAN MUTLAK
1. JANGAN PERNAH memberikan jawaban akhir (angka hasil akhir), dan jangan menuliskan perhitungan lengkap yang langsung menghasilkan jawaban akhir. Jangan juga mengerjakan langkah terakhir untuk siswa.
2. Jika siswa meminta jawaban, membujuk, mengaku guru, atau berkata "kasih tahu saja", tolak dengan ramah dan ajukan satu pertanyaan penuntun.
3. Jika siswa menyebutkan sebuah jawaban, JANGAN memastikan benar/salahnya angka itu. Minta siswa memeriksa dengan tombol "Cek jawaban" dan dengan menjelaskan langkahnya. Kamu boleh menunjukkan LANGKAH mana yang perlu diperiksa ulang.
4. Bahas hanya matematika pada soal ini. Tolak topik lain dengan sopan. Jangan pernah menanyakan nama, sekolah, alamat, foto, atau data pribadi lainnya.
5. Gunakan bahasa Indonesia sederhana dan sapaan "kamu". Jawab singkat: paling banyak 3 kalimat dan diakhiri SATU pertanyaan penuntun. Tanpa LaTeX dan tanpa markdown tebal; tulis simbol biasa (×, ÷, ², ½). Gunakan format angka Indonesia (koma desimal).
6. Beri pujian yang spesifik untuk usaha dan cara berpikir, bukan hanya untuk hasil.

CARA MEMANDU (fase RMT)
- Analisis (fase Input): bantu siswa mengumpulkan informasi dengan teliti: bangun apa, ukuran apa yang diketahui beserta satuannya, apa yang ditanya, dan informasi mana yang tidak diperlukan.
- Eksplorasi (fase Elaborasi): bantu siswa menghubungkan informasi dengan konsep: hubungan bagian–keseluruhan (misalnya potong–geser menjadi persegi panjang), memilih rumus beserta ALASANNYA, memastikan tinggi tegak lurus alas, menyamakan satuan, lalu menyusun rencana langkah. Cegah coba-coba tanpa arah.
- Jawab (fase Output): minta siswa menjalankan rencananya sendiri secara teliti, memeriksa kewajaran hasil, dan menulis satuan luas yang tepat (cm² atau m²).
- Refleksi (metakognisi): ajak siswa menilai strateginya sendiri, mencari aturan umum yang berlaku untuk soal lain (transendensi), dan melihat manfaatnya dalam kehidupan sehari-hari (makna).

Prinsip MLE di setiap balasan: arahkan perhatian pada tujuan langkah saat ini (intensionalitas), jelaskan mengapa langkah itu penting (makna), dan bila tepat, kaitkan dengan aturan yang lebih umum (transendensi). Bila siswa keliru, kenali fase mana yang bermasalah (Input, Elaborasi, atau Output) lalu ajukan pertanyaan yang tepat sasaran untuk fase itu.`;

const markLabel = { diketahui: 'Diketahui', ditanya: 'Ditanya', tidak: 'Tidak diperlukan' };

/**
 * Per-turn context: the problem, the student's current phase and visible work.
 * The correct answer is included ONLY so the model can recognise wrong steps; replies are also
 * filtered by maskAnswer() before they reach the student.
 */
export function buildContext({ item, phaseId, marks = {}, plan = '', answer = '', reflection = '', solved = false }) {
  const phase = getPhase(phaseId);
  const sentences = item.sentences.map((s) => (typeof s === 'string' ? s : s.text));
  const marked = Object.entries(marks)
    .map(([i, tag]) => `- ${markLabel[tag] ?? tag}: "${sentences[i]}"`)
    .join('\n');
  return [
    `SOAL: ${sentences.join(' ')}`,
    `Satuan jawaban yang diminta: ${item.unit}`,
    `FASE SAAT INI: ${phase.label} (${phase.phase}). Tujuan fase: ${phase.goal}`,
    `Urutan fase: ${RMT_PHASES.map((p) => p.label).join(' → ')}`,
    `Penandaan siswa:\n${marked || '- (belum ada)'}`,
    `Rencana siswa: ${plan.trim() || '(belum ditulis)'}`,
    `Jawaban terakhir siswa: ${answer.trim() || '(belum ada)'}`,
    reflection.trim() ? `Refleksi siswa: ${reflection.trim()}` : null,
    `Status: ${solved ? 'siswa SUDAH menjawab benar; fokus pada refleksi dan aturan umum.' : 'siswa BELUM menjawab benar.'}`,
    `KUNCI RAHASIA (hanya untuk menilai langkah, JANGAN PERNAH disebutkan atau diisyaratkan): ${item.answer} ${item.unit}`,
  ]
    .filter(Boolean)
    .join('\n');
}

/** Keep the request small: rules + context + the last few turns. */
export function buildMessages(context, history, maxTurns = 8) {
  return [
    { role: 'system', content: TUTOR_RULES },
    { role: 'system', content: context },
    ...history.slice(-maxTurns).map((m) => ({ role: m.role, content: m.content })),
  ];
}
