import { cn } from '@/lib/utils';
import { PandoraLogoMark } from './PandoraLogoMark';

interface PandoraLogoProps {
  /** Visual size of the seal in px. */
  size?: number;
  /** 'full' shows the wordmark lockup; 'mark' shows the seal only. */
  variant?: 'full' | 'mark';
  /** Color treatment. */
  tone?: 'ink' | 'light';
  className?: string;
}

/**
 * Primary Pandora Flowers logo lockup: the quatrefoil seal beside a
 * letter-spaced wordmark. Built on the brand mark so it stays pixel-faithful
 * to the avatar while reading as a luxury identity.
 */
export function PandoraLogo({
  size = 38,
  variant = 'full',
  tone = 'ink',
  className,
}: PandoraLogoProps) {
  const wordColor = tone === 'light' ? 'text-porcelain' : 'text-ink';
  const subColor = tone === 'light' ? 'text-porcelain/55' : 'text-ink-soft';

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <PandoraLogoMark size={size} title="Pandora Flowers" />
      {variant === 'full' && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-serif font-medium uppercase',
              wordColor,
            )}
            style={{ fontSize: size * 0.5, letterSpacing: '0.32em' }}
          >
            Pandora
          </span>
          <span
            className={cn('uppercase mt-1', subColor)}
            style={{ fontSize: size * 0.205, letterSpacing: '0.62em' }}
          >
            Flowers
          </span>
        </span>
      )}
    </span>
  );
}

export default PandoraLogo;
