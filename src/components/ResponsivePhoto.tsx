import type { CSSProperties } from 'react';

type Props = {
  file: string;
  alt: string;
  className?: string;
  sizes: string;
  eager?: boolean;
};

function optimized(file: string, width: 720 | 1440) {
  const name = file.split('/').pop() ?? file;
  const stem = name.replace(/\.[^.]+$/, '');
  return `/assets/optimized/${encodeURIComponent(stem)}-${width}.webp`;
}

export function ResponsivePhoto({ file, alt, className, sizes, eager = false }: Props) {
  const src = file.startsWith('/') ? file : `/assets/${file}`;
  const style: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };
  return <img src={src} srcSet={`${optimized(file, 720)} 720w, ${optimized(file, 1440)} 1440w`} sizes={sizes} alt={alt} className={className} style={style} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async"/>;
}
