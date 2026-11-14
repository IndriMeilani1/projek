import { useState } from 'react';
import { GENERATORS, MODULES } from '@/content/modules';
import { PracticeSet } from '@/features/practice/PracticeItem';
import { TestRunner } from '@/features/assessment/TestRunner';
import { attemptFileName, useAttempt } from '@/features/assessment/attempts';
import { logout, useSession } from '@/stores/session';
import { useAllProgress } from '@/stores/progress';
import { Feedback, Icon, PageHeader, Tabs } from '@/components/ui';
import { Link } from '@/app/router';
import { clearAll, downloadFile } from '@/utils/storage';

export function PracticePage() {
  const [mod, setMod] = useState(MODULES[2].id);
  const m = MODULES.find((x) => x.id === mod);
  return (
    <div>
      <PageHeader title="Latihan" subtitle="Soal cerita dengan Pembaca Soal, petunjuk bertingkat, dan soal mirip." />
      <Tabs tabs={MODULES.map((x) => ({ id: x.id, label: `M${x.no}` }))} value={mod} onChange={setMod} />
      <h2 className="mb-2 font-extrabold text-laut-900">{m.title}</h2>
      <PracticeSet key={mod} items={m.practice} generator={GENERATORS[mod]} />
    </div>
  );
}

export function TestPage({ params }) {
  const session = useSession();
  if (params.kind !== 'pre' && params.kind !== 'post') return <PageHeader title="Tes tidak ditemukan" back="/" />;
  return <TestRunner key={params.kind} kind={params.kind} session={session} />;
}

export function ProfilePage() {
  const session = useSession();
  const progress = useAllProgress();
  const pre = useAttempt(session, 'pre');
  const post = useAttempt(session, 'post');
  const [confirm, setConfirm] = useState(false);
  const done = MODULES.filter((m) => progress[m.id]?.done).length;

  return (
    <div className="space-y-4">
      <PageHeader title="Profil" subtitle={`Kelas ${session.classCode} · Kode ${session.studentCode}`} />
      <div className="card grid grid-cols-3 divide-x divide-kertas-300 p-4 text-center">
        <div>
          <div className="font-display text-4xl text-merah-600">{done}/7</div>
          <div className="text-xs font-bold text-slate-500">modul selesai</div>
        </div>
        <div>
          <div className="font-display text-4xl text-merah-600">{pre?.status === 'submitted' ? '✓' : '–'}</div>
          <div className="text-xs font-bold text-slate-500">pretest</div>
        </div>
        <div>
          <div className="font-display text-4xl text-merah-600">{post?.status === 'submitted' ? '✓' : '–'}</div>
          <div className="text-xs font-bold text-slate-500">posttest</div>
        </div>
      </div>

      {[pre, post].filter((a) => a?.status === 'submitted').map((a) => (
        <button key={a.id} className="btn-soft w-full" onClick={() => downloadFile(attemptFileName(a), JSON.stringify(a))}>
          <Icon name="download" /> Unduh file jawaban {a.kind === 'pre' ? 'pretest' : 'posttest'}
        </button>
      ))}

      <div className="card space-y-2 p-4">
        <button className="btn-ghost w-full justify-start" onClick={logout}>
          <Icon name="logout" /> Keluar (ganti siswa)
        </button>
        <Link to="/guru" className="btn-ghost w-full justify-start">
          <Icon name="lock" /> Mode guru / peneliti
        </Link>
        {!confirm ? (
          <button className="btn-ghost w-full justify-start text-rose-700" onClick={() => setConfirm(true)}>
            <Icon name="trash" /> Hapus semua data di HP ini
          </button>
        ) : (
          <Feedback tone="warn">
            Semua progres dan jawaban tes yang tersimpan di HP ini akan terhapus. Pastikan file jawaban sudah diserahkan ke guru.
            <div className="mt-2 flex gap-2">
              <button
                className="btn bg-rose-600 text-white"
                onClick={() => {
                  clearAll();
                  window.location.reload();
                }}
              >
                Ya, hapus
              </button>
              <button className="btn-ghost" onClick={() => setConfirm(false)}>
                Batal
              </button>
            </div>
          </Feedback>
        )}
      </div>
      <p className="text-center text-xs text-slate-400">GeOnePiece v0.1 · Pendidikan Matematika Untirta</p>
    </div>
  );
}
