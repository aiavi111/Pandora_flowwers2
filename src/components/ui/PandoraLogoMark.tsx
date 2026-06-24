interface PandoraLogoMarkProps {
  size?: number;
  className?: string;
  /** Stroke weight of the outer ring, in viewBox units (default 6.3). */
  ring?: number;
  title?: string;
}

/**
 * Pandora Flowers brand mark — a four-petal quatrefoil seal inside a ring.
 * Vectorised 1:1 from the official Instagram avatar, cleaned for web and
 * themeable via `currentColor` (works in ink, porcelain, or rose).
 *
 * The petals are exact tangent-teardrops with circular negative space;
 * see /public/images/brand for standalone SVG exports.
 */
const PETALS = [
  'M47.03 47.03L37.07 49.18A15.8 15.8 0 1 1 49.18 37.07ZM39.73 33.03A6.7 6.7 0 1 0 26.33 33.03A6.7 6.7 0 1 0 39.73 33.03Z',
  'M52.97 47.03L50.82 37.07A15.8 15.8 0 1 1 62.93 49.18ZM73.67 33.03A6.7 6.7 0 1 0 60.27 33.03A6.7 6.7 0 1 0 73.67 33.03Z',
  'M52.97 52.97L62.93 50.82A15.8 15.8 0 1 1 50.82 62.93ZM73.67 66.97A6.7 6.7 0 1 0 60.27 66.97A6.7 6.7 0 1 0 73.67 66.97Z',
  'M47.03 52.97L49.18 62.93A15.8 15.8 0 1 1 37.07 50.82ZM39.73 66.97A6.7 6.7 0 1 0 26.33 66.97A6.7 6.7 0 1 0 39.73 66.97Z',
];

export function PandoraLogoMark({
  size = 36,
  className = '',
  ring = 6.3,
  title,
}: PandoraLogoMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth={ring}
      />
      {PETALS.map((d) => (
        <path key={d} fillRule="evenodd" d={d} />
      ))}
    </svg>
  );
}

export default PandoraLogoMark;
