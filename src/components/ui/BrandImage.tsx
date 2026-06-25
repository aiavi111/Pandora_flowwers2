'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * BrandImage — renders a real photo when one exists, otherwise an elegant,
 * on-brand placeholder (a soft gradient tinted to the flower's colour with the
 * Pandora seal). This guarantees the site is never broken and never shows a
 * stock photo. Drop a real file at the given path and it appears automatically.
 */
type Tone =
  | 'red' | 'pink' | 'white' | 'cream' | 'peach'
  | 'yellow' | 'blue' | 'lilac' | 'green' | 'mixed' | 'ink' | 'default';

// Soft, tender pink/rosé family — no brown, tan or grey.
const TONES: Record<Tone, [string, string]> = {
  red:     ['#FCEAEE', '#F3CAD5'],
  pink:    ['#FDEDF3', '#F4CFDD'],
  white:   ['#FDF2F5', '#F2DEE8'],
  cream:   ['#FCEEF2', '#F1D8E1'],
  peach:   ['#FDECEC', '#F5CFCF'],
  yellow:  ['#FCEEF1', '#F2D7DE'],
  blue:    ['#F3ECF6', '#DCCDE9'],
  lilac:   ['#F4ECF6', '#E0CEEA'],
  green:   ['#F6ECF2', '#E2CDDD'],
  mixed:   ['#FCEAF1', '#F0CCDE'],
  ink:     ['#2A1E27', '#150E14'],
  default: ['#FCEDF3', '#F1D5E1'],
};

const MARK =
  'M47.03 47.03L37.07 49.18A15.8 15.8 0 1 1 49.18 37.07ZM39.73 33.03A6.7 6.7 0 1 0 26.33 33.03A6.7 6.7 0 1 0 39.73 33.03Z ' +
  'M52.97 47.03L50.82 37.07A15.8 15.8 0 1 1 62.93 49.18ZM73.67 33.03A6.7 6.7 0 1 0 60.27 33.03A6.7 6.7 0 1 0 73.67 33.03Z ' +
  'M52.97 52.97L62.93 50.82A15.8 15.8 0 1 1 50.82 62.93ZM73.67 66.97A6.7 6.7 0 1 0 60.27 66.97A6.7 6.7 0 1 0 73.67 66.97Z ' +
  'M47.03 52.97L49.18 62.93A15.8 15.8 0 1 1 37.07 50.82ZM39.73 66.97A6.7 6.7 0 1 0 26.33 66.97A6.7 6.7 0 1 0 39.73 66.97Z';

interface BrandImageProps {
  src?: string | null;
  alt: string;
  tone?: Tone;
  label?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

export function BrandImage({
  src, alt, tone = 'default', label,
  fill = true, width, height, sizes, priority, className, imgClassName,
}: BrandImageProps) {
  const [failed, setFailed] = useState(false);
  const show = src && !failed;
  const [c1, c2] = TONES[tone] ?? TONES.default;
  const dark = tone === 'ink';
  const markColor = dark ? '#FBF8F4' : '#1C1714';

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {show ? (
        <Image
          src={src as string}
          alt={alt}
          {...(fill ? { fill: true } : { width: width ?? 800, height: height ?? 1000 })}
          sizes={sizes}
          priority={priority}
          unoptimized={typeof src === 'string' && src.startsWith('data:')}
          onError={() => setFailed(true)}
          className={cn('object-cover w-full h-full', imgClassName)}
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ background: `radial-gradient(120% 120% at 30% 20%, ${c1}, ${c2})` }}
          aria-label={alt}
          role="img"
        >
          <div className="grain absolute inset-0 opacity-[0.12] mix-blend-multiply" />
          <svg viewBox="0 0 100 100" className="w-[34%] max-w-[120px] opacity-[0.16]" fill={markColor}>
            <circle cx="50" cy="50" r="45" fill="none" stroke={markColor} strokeWidth="6.3" />
            <path fillRule="evenodd" d={MARK} />
          </svg>
          {label && (
            <span
              className="mt-4 text-[0.6rem] uppercase tracking-[0.32em] font-medium"
              style={{ color: dark ? 'rgba(251,248,244,0.65)' : 'rgba(28,23,20,0.45)' }}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default BrandImage;
