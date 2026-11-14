// Logo orisinal GeOnePiece: kompas laut berbingkai emas; di dalamnya jajar genjang
// yang potongannya digeser menjadi persegi panjang (ide inti aplikasi).
export function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true">
      <rect width="512" height="512" rx="112" fill="#0b2a47" />
      <circle cx="256" cy="256" r="196" fill="#f7ecd2" stroke="#efb52c" strokeWidth="22" />
      <circle cx="256" cy="256" r="166" fill="none" stroke="#a9874f" strokeWidth="4" strokeDasharray="6 14" />
      <polygon points="256,24 276,70 236,70" fill="#d93a2b" />
      <polygon points="256,488 276,442 236,442" fill="#efb52c" />
      <polygon points="24,256 70,236 70,276" fill="#efb52c" />
      <polygon points="488,256 442,236 442,276" fill="#efb52c" />
      <polygon points="186,330 330,330 330,186 186,186" fill="#fdf8ec" stroke="#0b2a47" strokeWidth="10" strokeLinejoin="round" />
      <polygon points="330,330 382,186 330,186" fill="#d93a2b" stroke="#5e0f0a" strokeWidth="8" strokeLinejoin="round" />
      <polygon points="134,330 186,186 186,330" fill="none" stroke="#0b2a47" strokeWidth="6" strokeDasharray="14 12" opacity="0.5" />
      <line x1="186" y1="186" x2="186" y2="330" stroke="#ea580c" strokeWidth="12" strokeDasharray="22 14" />
      <line x1="134" y1="330" x2="330" y2="330" stroke="#2563eb" strokeWidth="16" strokeLinecap="round" />
    </svg>
  );
}
