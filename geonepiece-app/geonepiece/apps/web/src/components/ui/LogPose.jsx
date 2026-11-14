/**
 * Kompas gelang penunjuk pulau berikutnya (desain orisinal):
 * tali kulit, bola kaca berbingkai emas, jarum merah-biru yang sedikit bergoyang.
 * Animasi goyang dimatikan otomatis bila pengguna memilih "gerak dikurangi".
 */
export function LogPose({ angle = 0, size = 112, label }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={label ?? 'Kompas penunjuk pulau berikutnya'}>
      <defs>
        <radialGradient id="lp-glass" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="#d5e7f4" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2b7bb9" stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id="lp-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fae08a" />
          <stop offset="0.5" stopColor="#d99a1a" />
          <stop offset="1" stopColor="#8a5a0b" />
        </linearGradient>
      </defs>
      {/* Tali gelang */}
      <rect x="0" y="46" width="120" height="28" rx="6" fill="#6f522a" />
      <rect x="0" y="50" width="120" height="20" rx="4" fill="none" stroke="#3d2a14" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
      {/* Dudukan */}
      <circle cx="60" cy="60" r="40" fill="url(#lp-gold)" />
      <circle cx="60" cy="60" r="34" fill="#f7ecd2" />
      {/* Mata angin */}
      {[0, 90, 180, 270].map((r) => (
        <polygon key={r} points="60,30 63,40 57,40" fill={r === 0 ? '#d93a2b' : '#6f522a'} transform={`rotate(${r} 60 60)`} />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <line key={i} x1="60" y1="28" x2="60" y2={i % 4 ? 31 : 33} stroke="#a9874f" strokeWidth="1.2" transform={`rotate(${i * 22.5} 60 60)`} />
      ))}
      {/* Jarum */}
      <g style={{ '--needle': `${angle}deg`, transformOrigin: '60px 60px', transform: `rotate(${angle}deg)` }} className="animate-needle">
        <polygon points="60,32 65,60 55,60" fill="#d93a2b" />
        <polygon points="60,88 65,60 55,60" fill="#154c7a" />
        <circle cx="60" cy="60" r="4" fill="url(#lp-gold)" stroke="#3d2a14" strokeWidth="1" />
      </g>
      {/* Bola kaca */}
      <circle cx="60" cy="60" r="34" fill="url(#lp-glass)" opacity="0.55" />
      <ellipse cx="48" cy="44" rx="10" ry="5" fill="#fff" opacity="0.6" transform="rotate(-30 48 44)" />
      <circle cx="60" cy="60" r="40" fill="none" stroke="#3d2a14" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}
