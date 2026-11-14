import { motion } from 'motion/react';
import { Link } from './router';
import { Icon } from '@/components/ui';
import { Logo } from '@/components/ui/Logo';
import { OfflineBadge } from '@/features/pwa/PwaWidgets';

const NAV = [
  { to: '/', label: 'Beranda', icon: 'home', match: (p) => p === '/' },
  { to: '/belajar', label: 'Belajar', icon: 'book', match: (p) => p.startsWith('/belajar') },
  { to: '/lab', label: 'Lab', icon: 'flask', match: (p) => p.startsWith('/lab') || p.startsWith('/peta') },
  { to: '/latihan', label: 'Latihan', icon: 'target', match: (p) => p.startsWith('/latihan') },
  { to: '/profil', label: 'Profil', icon: 'user', match: (p) => p.startsWith('/profil') },
];

/** Header "geladak kapal": laut malam + tali emas. Di layar ≥ md, navigasi pindah ke sini. */
export function TopBar({ session, path, showNav }) {
  return (
    <header className="sea sticky top-0 z-20 text-white shadow-lg shadow-laut-950/30" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 md:h-16">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="GeOnePiece, ke beranda">
          <span className="rounded-xl ring-2 ring-emas-400/70">
            <Logo size={32} />
          </span>
          <span className="font-display text-2xl leading-none text-emas-300 drop-shadow-[0_2px_0_rgb(0_0_0/0.45)] md:text-[1.7rem]">GeOnePiece</span>
        </Link>

        {showNav && (
          <nav className="ml-6 hidden md:block" aria-label="Navigasi utama">
            <ul className="flex gap-1">
              {NAV.map((n) => {
                const active = n.match(path);
                return (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      aria-current={active ? 'page' : undefined}
                      className={`relative flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-extrabold transition ${active ? 'text-laut-950' : 'text-laut-100 hover:bg-white/10'}`}
                    >
                      {active && (
                        <motion.span layoutId="nav-top" className="absolute inset-0 rounded-xl bg-emas-400 shadow-[0_2px_0_var(--color-emas-700)]" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                      )}
                      <span className="relative flex items-center gap-1.5">
                        <Icon name={n.icon} size={18} /> {n.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <span className="ml-auto" />
        <OfflineBadge />
        {session && (
          <span className="chip max-w-[9.5rem] truncate bg-kertas-100 text-xs text-kertas-900 ring-2 ring-emas-400 sm:max-w-none">
            <span aria-hidden="true">☠</span> {session.classCode} · {session.studentCode}
          </span>
        )}
      </div>
      <div className="rope rounded-none opacity-90" aria-hidden="true" />
    </header>
  );
}

/** Navigasi bawah untuk HP (disembunyikan di layar ≥ md). */
export function BottomNav({ path }) {
  return (
    <nav
      className="sea fixed inset-x-0 bottom-0 z-30 border-t-4 border-emas-500 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navigasi utama"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {NAV.map((n) => {
          const active = n.match(path);
          return (
            <li key={n.to}>
              <Link
                to={n.to}
                className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 py-1.5 text-[0.7rem] font-extrabold ${active ? 'text-emas-300' : 'text-laut-100/80'}`}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute top-1 h-8 w-12 rounded-full bg-merah-500 shadow-[0_2px_0_var(--color-merah-700)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative grid h-8 place-items-center ${active ? 'text-white' : ''}`}>
                  <Icon name={n.icon} />
                </span>
                <span className="relative">{n.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
