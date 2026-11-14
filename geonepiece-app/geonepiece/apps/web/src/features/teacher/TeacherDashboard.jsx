import { useMemo, useState } from 'react';
import { createStore, useStore } from '@/stores/createStore';
import { useAllAttempts } from '@/features/assessment/attempts';
import { testToken, localDate } from '@/features/assessment/token';
import { fetchClassAttempts, hasApi } from '@/features/assessment/sync';
import { gainCsv, gainRows, scoresCsv, summarize } from '@/features/assessment/scoring';
import { allItems, ITEM_ORDER, ITEM_PROCESS, MAX_SCORE, PACKAGES, PROCESS } from '@/content/tests';
import { GENERAL_RUBRIC, KEYS } from '@/content/keys';
import { Feedback, Icon, PageHeader, Tabs } from '@/components/ui';
import { downloadFile } from '@/utils/storage';
import { fmt } from '@/utils/format';

/*
 * Mode Guru/Peneliti (bekerja offline):
 *  - Token tes harian per kelas
 *  - Mengumpulkan jawaban: dari HP ini, file .json siswa, atau API
 *  - Menilai jawaban uraian dengan rubrik 0–4
 *  - Rekap skor, per proses literasi, N-gain, dan ekspor CSV
 */
const teacherStore = createStore('teacher', { pin: '2026', unlocked: false, imported: {}, scores: {}, notes: {} });
const setT = (patch) => teacherStore.set((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));

export default function TeacherDashboard() {
  const t = useStore(teacherStore);
  const [tab, setTab] = useState('token');
  if (!t.unlocked) return <PinGate pin={t.pin} />;
  return (
    <div>
      <PageHeader
        title="Mode Guru / Peneliti"
        subtitle="Token tes, penilaian rubrik, rekap N-gain, ekspor"
        back="/"
        right={
          <button className="btn-ghost" onClick={() => setT({ unlocked: false })}>
            <Icon name="lock" /> Kunci
          </button>
        }
      />
      <Tabs
        tabs={[
          { id: 'token', label: 'Token Tes' },
          { id: 'data', label: 'Kumpulkan Jawaban' },
          { id: 'nilai', label: 'Penilaian' },
          { id: 'rekap', label: 'Rekap & Ekspor' },
          { id: 'atur', label: 'Pengaturan' },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === 'token' && <TokenTab />}
      {tab === 'data' && <DataTab />}
      {tab === 'nilai' && <ScoringTab />}
      {tab === 'rekap' && <RecapTab />}
      {tab === 'atur' && <SettingsTab />}
    </div>
  );
}

function PinGate({ pin }) {
  const [v, setV] = useState('');
  const [err, setErr] = useState(false);
  return (
    <form
      className="card mx-auto mt-6 max-w-sm space-y-3 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (v === pin) setT({ unlocked: true });
        else setErr(true);
      }}
    >
      <h1 className="text-xl font-extrabold text-laut-900">Mode Guru / Peneliti</h1>
      <label className="label" htmlFor="pin">
        PIN guru
      </label>
      <input id="pin" type="password" inputMode="numeric" className="input text-center text-2xl tracking-widest" value={v} onChange={(e) => { setV(e.target.value); setErr(false); }} />
      {err && <Feedback tone="warn">PIN salah.</Feedback>}
      <button className="btn-primary w-full">Buka</button>
      <p className="text-xs text-slate-500">PIN awal: 2026. Segera ganti di tab Pengaturan.</p>
    </form>
  );
}

// ---------- Token ----------
function TokenTab() {
  const [cls, setCls] = useState('7A');
  const [date, setDate] = useState(localDate());
  const d = new Date(`${date}T12:00:00`);
  return (
    <div className="card space-y-4 p-5">
      <p className="text-slate-600">Bacakan token kepada siswa saat tes dimulai. Token berlaku untuk satu kelas, satu jenis tes, dan satu hari — dan bekerja tanpa internet.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <span className="label">Kode kelas</span>
          <input className="input uppercase" value={cls} onChange={(e) => setCls(e.target.value)} />
        </label>
        <label>
          <span className="label">Tanggal tes</span>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {['pre', 'post'].map((k) => (
          <div key={k} className="rounded-3xl bg-laut-50 p-5 text-center ring-1 ring-laut-100">
            <p className="font-bold text-laut-700">{k === 'pre' ? 'Pretest (Paket A)' : 'Posttest (Paket B)'}</p>
            <p className="mt-1 font-mono text-4xl font-extrabold tracking-[0.3em] text-laut-900">{cls.trim() ? testToken(cls, k, d) : '——'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Pengumpulan data ----------
function useCombinedAttempts() {
  const local = useAllAttempts();
  const { imported } = useStore(teacherStore);
  return useMemo(() => {
    const map = { ...imported };
    for (const a of Object.values(local)) if (a.status === 'submitted') map[a.id] = a;
    return Object.values(map).sort((x, y) => `${x.classCode}${x.studentCode}${x.kind}`.localeCompare(`${y.classCode}${y.studentCode}${y.kind}`, 'id', { numeric: true }));
  }, [local, imported]);
}

function DataTab() {
  const attempts = useCombinedAttempts();
  const [msg, setMsg] = useState(null);
  const [cls, setCls] = useState('');
  const [key, setKey] = useState('');

  const importFiles = async (files) => {
    let ok = 0;
    let bad = 0;
    const add = {};
    for (const f of files) {
      try {
        const data = JSON.parse(await f.text());
        const list = Array.isArray(data) ? data : [data];
        for (const a of list) {
          if (a?.id && a.answers && a.kind) {
            add[a.id] = a;
            ok++;
          } else bad++;
        }
      } catch {
        bad++;
      }
    }
    setT((s) => ({ imported: { ...s.imported, ...add } }));
    setMsg({ tone: bad ? 'warn' : 'ok', text: `${ok} lembar jawaban diimpor${bad ? `, ${bad} file tidak dikenali` : ''}.` });
  };

  const pull = async () => {
    try {
      const list = await fetchClassAttempts(cls.trim().toUpperCase(), key);
      setT((s) => ({ imported: { ...s.imported, ...Object.fromEntries(list.map((a) => [a.id, a])) } }));
      setMsg({ tone: 'ok', text: `${list.length} lembar jawaban diambil dari server.` });
    } catch (e) {
      setMsg({ tone: 'warn', text: e.message });
    }
  };

  return (
    <div className="space-y-4">
      <div className="card space-y-3 p-5">
        <h2 className="font-extrabold text-laut-900">1. Impor file jawaban siswa (.json)</h2>
        <p className="text-sm text-slate-600">Siswa menekan "Unduh file jawaban" setelah tes, lalu mengirimkannya (WhatsApp/Drive/kabel). Pilih semua file sekaligus.</p>
        <label className="btn-soft cursor-pointer">
          <Icon name="upload" /> Pilih file
          <input type="file" accept=".json,application/json" multiple className="sr-only" onChange={(e) => importFiles([...e.target.files])} />
        </label>
      </div>
      {hasApi() && (
        <div className="card space-y-3 p-5">
          <h2 className="font-extrabold text-laut-900">2. Ambil dari server</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            <input className="input uppercase" placeholder="Kode kelas" value={cls} onChange={(e) => setCls(e.target.value)} />
            <input className="input" type="password" placeholder="Kunci guru (server)" value={key} onChange={(e) => setKey(e.target.value)} />
            <button className="btn-primary" onClick={pull} disabled={!cls || !key}>
              <Icon name="download" /> Ambil
            </button>
          </div>
        </div>
      )}
      {msg && <Feedback tone={msg.tone}>{msg.text}</Feedback>}
      <div className="card p-5">
        <h2 className="mb-2 font-extrabold text-laut-900">Lembar jawaban terkumpul: {attempts.length}</h2>
        <ul className="divide-y divide-slate-100 text-sm">
          {attempts.map((a) => (
            <li key={a.id} className="flex justify-between py-2">
              <span className="font-bold">
                {a.classCode} / {a.studentCode}
              </span>
              <span className="text-slate-500">
                {a.kind === 'pre' ? 'Pretest A' : 'Posttest B'} · {a.submittedAt ? new Date(a.submittedAt).toLocaleString('id-ID') : '-'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------- Penilaian rubrik ----------
function ScoringTab() {
  const attempts = useCombinedAttempts();
  const { scores, notes } = useStore(teacherStore);
  const [sel, setSel] = useState(attempts[0]?.id ?? null);
  const [itemIdx, setItemIdx] = useState(0);
  const attempt = attempts.find((a) => a.id === sel);

  if (!attempts.length) return <Feedback tone="info">Belum ada lembar jawaban. Kumpulkan dulu di tab "Kumpulkan Jawaban".</Feedback>;

  const pkg = PACKAGES[attempt?.package ?? 'A'];
  const items = allItems(pkg);
  const item = items[itemIdx];
  const ans = attempt?.answers?.[item.no] ?? {};
  const key = KEYS[item.no];
  const myScores = scores[attempt?.id] ?? {};
  const setScore = (v) => setT((s) => ({ scores: { ...s.scores, [attempt.id]: { ...(s.scores[attempt.id] ?? {}), [item.no]: v } } }));
  const noteKey = `${attempt?.id}|${item.no}`;

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <aside className="card max-h-[70vh] overflow-y-auto p-2">
        {attempts.map((a) => {
          const s = summarize(scores[a.id]);
          return (
            <button key={a.id} onClick={() => { setSel(a.id); setItemIdx(0); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${a.id === sel ? 'bg-laut-100 font-extrabold' : 'hover:bg-slate-50'}`}>
              <span>
                {a.studentCode} <span className="text-slate-500">· {a.kind === 'pre' ? 'Pre' : 'Post'}</span>
              </span>
              <span className={`chip px-2 py-0 text-xs ${s.complete ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{s.scored}/10</span>
            </button>
          );
        })}
      </aside>
      {attempt && (
        <section className="space-y-3">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {items.map((it, i) => (
              <button key={it.no} onClick={() => setItemIdx(i)} className={`size-11 shrink-0 rounded-xl text-sm font-extrabold ring-2 ${i === itemIdx ? 'bg-laut-700 text-white ring-laut-700' : typeof myScores[it.no] === 'number' ? 'bg-emerald-50 ring-emerald-200' : 'bg-white ring-slate-200'}`}>
                {it.no}
              </button>
            ))}
          </div>
          <div className="grid gap-3 xl:grid-cols-2">
            <div className="card space-y-2 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">
                {attempt.classCode}/{attempt.studentCode} · Paket {attempt.package} · Soal {item.no} · {PROCESS[ITEM_PROCESS[item.no]]}
              </p>
              <p className="font-semibold">{item.prompt}</p>
              {item.type === 'choice' && (
                <p className="font-bold">
                  Pilihan: {ans.choice ?? '—'} {ans.choice && (ans.choice === key.choice ? '✓ benar' : '✗')}
                </p>
              )}
              <div className="min-h-24 whitespace-pre-wrap rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">{ans.text?.trim() || <i className="text-slate-400">(tidak ada jawaban tertulis)</i>}</div>
              {ans.sketch && <img src={ans.sketch} alt="Sketsa siswa" className="w-full rounded-xl ring-1 ring-slate-200" />}
            </div>
            <div className="card space-y-3 p-4">
              <div>
                <p className="text-xs font-bold uppercase text-laut-700">Kunci Paket {attempt.package}</p>
                <p className="text-sm">{key[attempt.package]}</p>
                <p className="mt-2 text-xs text-slate-600">{key.notes}</p>
              </div>
              <div className="space-y-1.5">
                {[4, 3, 2, 1, 0].map((v) => (
                  <button key={v} onClick={() => setScore(v)} className={`flex w-full gap-3 rounded-2xl p-2 text-left text-sm ring-2 transition ${myScores[item.no] === v ? 'bg-laut-700 text-white ring-laut-700' : 'bg-white ring-slate-200 hover:ring-laut-200'}`}>
                    <b className="w-5 text-center text-lg">{v}</b>
                    <span>{GENERAL_RUBRIC[ITEM_PROCESS[item.no]][v]}</span>
                  </button>
                ))}
              </div>
              <textarea className="input min-h-16 text-sm" placeholder="Catatan penilai (opsional)" value={notes[noteKey] ?? ''} onChange={(e) => setT((s) => ({ notes: { ...s.notes, [noteKey]: e.target.value } }))} />
              <button className="btn-primary w-full" onClick={() => setItemIdx((i) => Math.min(items.length - 1, i + 1))} disabled={itemIdx === items.length - 1}>
                Soal berikutnya <Icon name="arrowRight" />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ---------- Rekap ----------
function RecapTab() {
  const attempts = useCombinedAttempts();
  const { scores } = useStore(teacherStore);
  const rows = gainRows(attempts, scores);
  const withGain = rows.filter((r) => r.gain != null);
  const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
  const meanPre = mean(rows.filter((r) => r.pre?.complete).map((r) => r.pre.total));
  const meanPost = mean(rows.filter((r) => r.post?.complete).map((r) => r.post.total));
  const meanGain = mean(withGain.map((r) => r.gain));
  const procMean = (kind) =>
    Object.fromEntries(Object.keys(PROCESS).map((p) => [p, mean(rows.filter((r) => r[kind]?.complete).map((r) => r[kind].perPct[p]))]));
  const pp = procMean('pre');
  const po = procMean('post');

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['Rata-rata pretest', meanPre, `/ ${MAX_SCORE}`],
          ['Rata-rata posttest', meanPost, `/ ${MAX_SCORE}`],
          ['Rata-rata N-gain', meanGain, meanGain == null ? '' : meanGain >= 0.7 ? '(tinggi)' : meanGain >= 0.3 ? '(sedang)' : '(rendah)'],
        ].map(([l, v, s]) => (
          <div key={l} className="card p-4 text-center">
            <p className="text-sm font-bold text-slate-500">{l}</p>
            <p className="text-3xl font-extrabold text-laut-900">{v == null ? '–' : fmt(v)}</p>
            <p className="text-xs text-slate-500">{s}</p>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <h2 className="mb-3 font-extrabold text-laut-900">Capaian per proses literasi (rata-rata %)</h2>
        <div className="space-y-3">
          {Object.entries(PROCESS).map(([k, name]) => (
            <div key={k}>
              <p className="mb-1 text-sm font-bold">{name}</p>
              {[
                ['Pre', pp[k], 'bg-slate-400'],
                ['Post', po[k], 'bg-laut-500'],
              ].map(([lab, v, c]) => (
                <div key={lab} className="mb-1 flex items-center gap-2 text-xs">
                  <span className="w-8 font-bold text-slate-500">{lab}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${c} transition-all duration-700`} style={{ width: `${v ?? 0}%` }} />
                  </div>
                  <span className="w-10 text-right tabular-nums">{v == null ? '–' : `${Math.round(v)}%`}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2">Siswa</th>
              <th>Pretest</th>
              <th>Posttest</th>
              <th>N-gain</th>
              <th>Kategori</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={`${r.classCode}.${r.studentCode}`}>
                <td className="py-2 font-bold">
                  {r.classCode}/{r.studentCode}
                </td>
                <td>{r.pre ? `${r.pre.total}${r.pre.complete ? '' : '*'}` : '–'}</td>
                <td>{r.post ? `${r.post.total}${r.post.complete ? '' : '*'}` : '–'}</td>
                <td className="tabular-nums">{r.gain == null ? '–' : fmt(r.gain)}</td>
                <td>{r.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-slate-500">* belum semua butir dinilai. N-gain dihitung hanya bila pretest dan posttest sudah dinilai lengkap.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={() => downloadFile(`skor_per_butir_${localDate()}.csv`, scoresCsv(attempts, scores), 'text/csv')}>
          <Icon name="download" /> Skor per butir (CSV)
        </button>
        <button className="btn-soft" onClick={() => downloadFile(`rekap_ngain_${localDate()}.csv`, gainCsv(rows), 'text/csv')}>
          <Icon name="download" /> Rekap N-gain (CSV)
        </button>
        <button className="btn-ghost" onClick={() => downloadFile(`backup_penilaian_${localDate()}.json`, JSON.stringify({ attempts, scores: teacherStore.get().scores, notes: teacherStore.get().notes }))}>
          <Icon name="download" /> Cadangan lengkap (JSON)
        </button>
      </div>
      <p className="text-xs text-slate-500">
        Kolom CSV: {ITEM_ORDER.join(', ')}. File CSV memakai pemisah titik koma (;) dan koma desimal, siap dibuka di Excel dan dianalisis dengan skrip Python di folder analysis/.
      </p>
    </div>
  );
}

function SettingsTab() {
  const { pin } = useStore(teacherStore);
  const [v, setV] = useState('');
  const [done, setDone] = useState(false);
  return (
    <div className="card max-w-md space-y-3 p-5">
      <h2 className="font-extrabold text-laut-900">Ganti PIN guru</h2>
      <input className="input" type="password" inputMode="numeric" placeholder="PIN baru (min. 4 angka)" value={v} onChange={(e) => { setV(e.target.value); setDone(false); }} />
      <button className="btn-primary" disabled={v.length < 4 || v === pin} onClick={() => { setT({ pin: v }); setDone(true); setV(''); }}>
        Simpan PIN
      </button>
      {done && <Feedback tone="ok">PIN diperbarui.</Feedback>}
      <p className="text-xs text-slate-500">
        PIN hanya melindungi tampilan di HP/laptop ini. Untuk penelitian, gunakan perangkat guru tersendiri, karena kunci jawaban ikut tersimpan di aplikasi.
      </p>
    </div>
  );
}
