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

const TONES: Record<Tone, [string, string]> = {
  red:     ['#F4E3E5', '#E3BFC6'],
  pink:    ['#F8E8ED', '#EDCBD7'],
  white:   ['#FAF7F3', '#EAE1D6'],
  cream:   ['#F8F1E5', '#E9DECC'],
  peach:   ['#F9EAE0', '#EECFBE'],
  yellow:  ['#F7F1DD', '#E9DCBA'],
  blue:    ['#E6EBF1', '#CCD7E4'],
  lilac:   ['#ECE6F2', '#D6CCE5'],
  green:   ['#E7EFE7', '#CCDFCF'],
  mixed:   ['#F3E8EC', '#E0CFD7'],
  ink:     ['#2A2420', '#15110F'],
  default: ['#F4ECE3', '#E5D6C8'],
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
