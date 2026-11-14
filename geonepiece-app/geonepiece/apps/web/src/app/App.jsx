import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { matchPath, useHashPath } from './router';
import { BottomNav, TopBar } from './Layout';
import { useSession } from '@/stores/session';
import { startAutoSync } from '@/features/assessment/sync';
import { InstallPrompt } from '@/features/pwa/PwaWidgets';
import { pageVariants } from '@/motion/springs';
import { PageHeader } from '@/components/ui';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import { LabPage, LearnPage, MapPage, ModulePage } from '@/pages/LearnPages';
import { PracticePage, ProfilePage, TestPage } from '@/pages/OtherPages';

// Dasbor guru dimuat terpisah (berisi kunci jawaban; tidak ikut bundel awal siswa).
const TeacherDashboard = lazy(() => import('@/features/teacher/TeacherDashboard'));

const ROUTES = [
  ['/', HomePage],
  ['/belajar', LearnPage],
  ['/belajar/:id', ModulePage],
  ['/lab', LabPage],
  ['/lab/:id', LabPage],
  ['/peta', MapPage],
  ['/latihan', PracticePage],
  ['/tes/:kind', TestPage],
  ['/profil', ProfilePage],
  ['/guru', TeacherDashboard],
];

const NotFound = () => <PageHeader title="Halaman tidak ditemukan" back="/" />;

export default function App() {
  const path = useHashPath();
  const session = useSession();

  useEffect(() => startAutoSync(), []);

  let Page = NotFound;
  let params = {};
  for (const [pattern, Component] of ROUTES) {
    const m = matchPath(pattern, path);
    if (m) {
      Page = Component;
      params = m;
      break;
    }
  }
  const isTeacher = path.startsWith('/guru');
  if (!session && !isTeacher) {
    Page = LoginPage;
    params = {};
  }
  // Saat tes & mode guru: navigasi bawah disembunyikan agar fokus.
  const immersive = path.startsWith('/tes/') || isTeacher;

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-dvh flex-col">
        <TopBar session={session} path={path} showNav={!!session && !immersive} />
        <main className={`mx-auto w-full flex-1 px-4 pt-4 ${isTeacher ? 'max-w-6xl' : 'max-w-3xl lg:max-w-4xl'} ${immersive ? 'pb-10' : 'pb-28 md:pb-12'} md:px-6 md:pt-6`}>
          <AnimatePresence mode="wait">
            <motion.div key={session ? path : 'login'} variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Suspense fallback={<div className="card h-40 animate-pulse" aria-label="Memuat…" />}>
                <Page params={params} />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
        {session && !immersive && <BottomNav path={path} />}
        <InstallPrompt hidden={immersive} />
      </div>
    </MotionConfig>
  );
}
