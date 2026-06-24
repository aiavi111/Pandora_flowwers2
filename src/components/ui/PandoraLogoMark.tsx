interface PandoraLogoMarkProps {
  size?: number;
  className?: string;
}

export function PandoraLogoMark({ size = 36, className = '' }: PandoraLogoMarkProps) {
  // Each petal: sector shape with outer arc + inner oval hole
  // Tip of each petal meets at center (50,50)
  // Fat rounded end faces outward into quadrant
  const outer = 'M50,50 L50,34 C50,20 40,10 28,10 C16,10 8,20 8,32 C8,44 18,50 34,50 Z';
  const hole  = 'M28,22 C30,14 42,16 40,27 C38,37 25,37 23,28 C21,19 25,30 28,22 Z';
  const petal = `${outer} ${hole}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Outer ring */}
      <path
        fillRule="evenodd"
        d="M50 3a47 47 0 1 0 0 94A47 47 0 0 0 50 3zm0 8a39 39 0 1 1 0 78 39 39 0 0 1 0-78z"
      />
      {/* Top-left petal */}
      <path fillRule="evenodd" d={petal} />
      {/* Top-right petal (rotate -90° = CCW) */}
      <g transform="rotate(-90 50 50)">
        <path fillRule="evenodd" d={petal} />
      </g>
      {/* Bottom-right petal (rotate 180°) */}
      <g transform="rotate(180 50 50)">
        <path fillRule="evenodd" d={petal} />
      </g>
      {/* Bottom-left petal (rotate 90° = CW) */}
      <g transform="rotate(90 50 50)">
        <path fillRule="evenodd" d={petal} />
      </g>
    </svg>
  );
}
