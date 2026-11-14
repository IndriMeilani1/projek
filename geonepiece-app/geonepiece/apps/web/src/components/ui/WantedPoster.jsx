import { motion } from 'motion/react';

const intf = new Intl.NumberFormat('id-ID');

/**
 * Poster "DICARI" bergaya kertas tua (desain orisinal).
 * `children` mengisi bingkai potret (mis. tangram progres siswa).
 */
export function WantedPoster({ name, caption, bounty, children, className = '' }) {
  return (
    <motion.figure
      initial={{ rotate: -4, y: 12, opacity: 0 }}
      animate={{ rotate: -1.5, y: 0, opacity: 1 }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className={`relative mx-auto w-full max-w-[17rem] select-none ${className}`}
    >
      {/* Paku penahan poster */}
      <span aria-hidden="true" className="absolute -top-2 left-1/2 z-10 size-4 -translate-x-1/2 rounded-full bg-gradient-to-br from-slate-300 to-slate-700 shadow-md ring-2 ring-black/20" />
      <div
        className="relative overflow-hidden px-4 pt-4 pb-3 text-center text-kertas-900 shadow-[0_14px_30px_-12px_rgb(0_0_0/0.6)]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, #fbf1d6 0%, #f1dfb2 60%, #d9bb80 100%)',
          clipPath:
            'polygon(0 1.5%, 6% 0, 18% 1.2%, 33% 0, 51% 1%, 67% 0, 84% 1.4%, 100% 0, 99% 18%, 100% 41%, 98.6% 63%, 100% 84%, 99% 100%, 80% 98.8%, 61% 100%, 42% 98.6%, 23% 100%, 7% 98.8%, 0 100%, 1.2% 79%, 0 57%, 1.4% 34%, 0 14%)',
        }}
      >
        <div className="rounded-sm border-2 border-kertas-700/70 p-2 outline outline-1 outline-offset-2 outline-kertas-700/40">
          <p className="font-poster text-[2.6rem] leading-none text-kertas-900 sm:text-5xl">DICARI</p>
          <p className="mt-1 text-[0.65rem] font-black tracking-[0.3em] text-kertas-700">PENJELAJAH GEOMETRI</p>
          <div className="mx-auto mt-2 aspect-[4/3.2] w-full overflow-hidden rounded-sm border-[3px] border-kertas-900/80 bg-laut-900 sea">
            <div className="grid h-full place-items-center p-2">{children}</div>
          </div>
          <p className="mt-2 truncate font-poster text-2xl leading-tight">{name}</p>
          {caption && <p className="text-[0.7rem] font-extrabold tracking-wider text-kertas-700">{caption}</p>}
          <div className="mt-1.5 flex items-center justify-center gap-2 border-t-2 border-dashed border-kertas-700/50 pt-1.5">
            <span className="text-[0.65rem] font-black tracking-widest text-kertas-700">HADIAH</span>
            <span className="font-poster text-xl leading-none tabular-nums text-merah-700">
              <span aria-hidden="true" className="mr-0.5 text-emas-600">✦</span>
              {intf.format(bounty)}
            </span>
          </div>
          <p className="mt-0.5 text-[0.6rem] font-bold tracking-wide text-kertas-700/80">keping emas pengetahuan</p>
        </div>
      </div>
    </motion.figure>
  );
}
