import { useEffect, useState } from 'react';

// Router berbasis hash (#/belajar/m2): tidak perlu konfigurasi server dan aman untuk PWA offline.
const readPath = () => (window.location.hash.replace(/^#/, '') || '/').split('?')[0];

export function useHashPath() {
  const [path, setPath] = useState(readPath);
  useEffect(() => {
    const onChange = () => {
      setPath(readPath());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return path;
}

export const navigate = (to) => {
  window.location.hash = to;
};

export function Link({ to, children, ...rest }) {
  return (
    <a href={`#${to}`} {...rest}>
      {children}
    </a>
  );
}

/** Cocokkan "/belajar/:id" dengan "/belajar/m2" → { id: "m2" }, atau null. */
export function matchPath(pattern, path) {
  const a = pattern.split('/').filter(Boolean);
  const b = path.split('/').filter(Boolean);
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}
