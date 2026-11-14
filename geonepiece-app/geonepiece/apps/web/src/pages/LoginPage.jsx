import { useState } from 'react';
import { motion } from 'motion/react';
import { login } from '@/stores/session';
import { Icon } from '@/components/ui';
import { Link } from '@/app/router';
import { Logo } from '@/components/ui/Logo';
import { LogPose } from '@/components/ui/LogPose';

export default function LoginPage() {
  const [classCode, setClassCode] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [agree, setAgree] = useState(false);
  const valid = classCode.trim().length >= 2 && studentCode.trim().length >= 2 && agree;

  return (
    <div className="mx-auto grid max-w-4xl items-center gap-6 pt-2 md:grid-cols-2 md:gap-10 md:pt-8">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center md:text-left">
        <div className="relative mx-auto mb-3 w-fit md:mx-0">
          <div className="animate-float rounded-[28px] ring-4 ring-emas-400 shadow-xl shadow-laut-950/30">
            <Logo size={104} />
          </div>
        </div>
        <h1 className="font-display text-5xl leading-none text-laut-900 sm:text-6xl">GeOnePiece</h1>
        <div className="rope mx-auto mt-2 w-28 md:mx-0" aria-hidden="true" />
        <p className="mt-3 text-lg font-bold text-slate-700">
          Potong, geser, susun ulang — <span className="text-merah-600">temukan sendiri</span> rumus luas bangun datar!
        </p>
        <div className="mt-5 hidden items-center gap-3 rounded-2xl bg-laut-900 p-3 text-left text-white ring-2 ring-emas-500 md:flex">
          <LogPose angle={-30} size={84} />
          <p className="text-sm text-laut-100">
            Tujuh pulau bangun datar menunggumu. Setiap pulau yang ditaklukkan memberimu satu <b className="text-emas-300">kepingan peta harta</b>.
          </p>
        </div>
      </motion.div>

      <motion.form
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="card relative space-y-4 p-5 pt-7 sm:p-6 sm:pt-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) login({ classCode, studentCode });
        }}
      >
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-merah-500 px-4 py-1.5 font-display text-lg leading-none text-white shadow-[0_3px_0_var(--color-merah-700)] ring-2 ring-kertas-50">
          ☠ Kartu Awak Kapal
        </span>
        <div>
          <label className="label" htmlFor="kelas">
            Kode kelas
          </label>
          <input id="kelas" className="input uppercase" value={classCode} onChange={(e) => setClassCode(e.target.value)} placeholder="contoh: 7A" autoComplete="off" />
        </div>
        <div>
          <label className="label" htmlFor="siswa">
            Kode siswa
          </label>
          <input id="siswa" className="input uppercase" value={studentCode} onChange={(e) => setStudentCode(e.target.value)} placeholder="contoh: S01" autoComplete="off" />
          <p className="mt-1 text-xs text-slate-500">Kode diberikan oleh guru. Tidak perlu nama, email, atau nomor HP.</p>
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-kertas-100 p-3 text-sm ring-1 ring-kertas-300">
          <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-merah-500" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>Saya mengikuti kegiatan ini atas izin guru/sekolah dan bersedia jawaban saya dipakai untuk penelitian tanpa nama.</span>
        </label>
        <button className="btn-primary w-full text-lg" disabled={!valid}>
          Naik ke kapal <Icon name="arrowRight" />
        </button>
      </motion.form>

      <p className="text-center text-sm md:col-span-2">
        <Link to="/guru" className="inline-flex min-h-11 items-center font-bold text-laut-700 underline decoration-emas-400 decoration-2 underline-offset-4">
          Masuk sebagai guru / peneliti
        </Link>
      </p>
    </div>
  );
}
