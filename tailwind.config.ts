import type { Config } from 'tailwindcss'

/**
 * Pandora Flowers — "Atelier" design system.
 * Editorial ivory & ink, with a muted mauve-rose accent and sparing champagne.
 * The legacy `pandora.*` scale is preserved (so existing screens inherit the
 * new palette automatically) and richer semantic tokens are layered on top.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Semantic tokens (use these in new work) ──
        porcelain: {
          DEFAULT: '#FDFCFB', // near-white, faint warmth
          deep: '#F5F1EB',    // alternating sections
        },
        linen: '#F1E9DE',
        ink: {
          DEFAULT: '#1C1714', // espresso near-black
          700: '#2E2722',
          soft: '#6F665F',    // secondary text
          muted: '#9C928A',   // tertiary text
        },
        accent: {
          DEFAULT: '#B07C90', // mauve-rose
          deep: '#8C5C70',    // hover / active
          soft: '#F3E6EA',    // tint fills
          glow: '#CDA0AF',
        },
        champagne: {
          DEFAULT: '#BE9E63',
          soft: '#E7D5AC',
        },
        line: '#E9E0D5',      // warm hairline

        // ── Legacy scale, retuned to the new palette ──
        pandora: {
          cream:        '#FDFCFB',
          black:        '#1C1714',
          dark:         '#221C18',
          rose:         '#B07C90',
          'rose-light': '#CDA0AF',
          blush:        '#F3E6EA',
          gold:         '#BE9E63',
          'gold-light': '#E7D5AC',
          pink:         '#EBD3DA',
          text:         '#1C1714',
          muted:        '#8B817A',
          border:       '#E9E0D5',
        },
      },
      fontFamily: {
        // Single clean typeface; `serif` is kept as an alias to Inter so any
        // legacy `font-serif` usage renders as clean modern sans, not a serif.
        serif: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        sans:  ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['0.72rem', { lineHeight: '1', letterSpacing: '0.34em' }],
        'display-sm': ['clamp(2rem, 4vw, 2.75rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'display':    ['clamp(2.6rem, 5.5vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.015em' }],
        'display-lg': ['clamp(3.2rem, 8vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        luxe: '0.18em',
        wider2: '0.28em',
        widest2: '0.42em',
      },
      borderRadius: {
        card: '20px',
        media: '18px',
        xl2: '28px',
        input: '12px',
        pill: '999px',
      },
      backgroundImage: {
        'ink-gradient':    'linear-gradient(150deg, #221C18 0%, #2E2722 48%, #1C1714 100%)',
        'rose-gradient':   'linear-gradient(135deg, #B07C90 0%, #CDA0AF 100%)',
        'blush-gradient':  'linear-gradient(180deg, #FBF8F4 0%, #F3E6EA 100%)',
        'porcelain-fade':  'linear-gradient(180deg, #FFFFFF 0%, #FDFCFB 55%, #F5F1EB 100%)',
        'champagne-line':  'linear-gradient(90deg, transparent, #BE9E63, transparent)',
        'sheen':           'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
      },
      boxShadow: {
        // legacy keys, retuned
        luxury:       '0 18px 60px -24px rgba(140, 92, 112, 0.28)',
        card:         '0 1px 2px rgba(28,23,20,0.04), 0 10px 30px -16px rgba(28,23,20,0.10)',
        'card-hover': '0 12px 28px -10px rgba(28,23,20,0.16), 0 36px 64px -32px rgba(140,92,112,0.20)',
        // new semantic
        soft:    '0 1px 2px rgba(28,23,20,0.04), 0 12px 32px -18px rgba(28,23,20,0.12)',
        lift:    '0 14px 30px -12px rgba(28,23,20,0.18), 0 40px 70px -34px rgba(140,92,112,0.22)',
        glow:    '0 0 0 1px rgba(190,158,99,0.25), 0 18px 50px -18px rgba(190,158,99,0.35)',
        insetTop:'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-soft': 'cubic-bezier(0.65, 0, 0.35, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in':   'fadeIn 0.7s var(--ease-out-expo) both',
        'fade-up':   'fadeUp 0.8s var(--ease-out-expo) both',
        'scale-in':  'scaleIn 0.6s var(--ease-out-expo) both',
        'slide-up':  'fadeUp 0.6s var(--ease-out-expo) both',
        'slide-in-right': 'slideInRight 0.45s var(--ease-out-expo) both',
        shimmer:     'shimmer 2.2s linear infinite',
        marquee:     'marquee 38s linear infinite',
        float:       'float 7s ease-in-out infinite',
        'pulse-soft':'pulseSoft 2.6s ease-in-out infinite',
        kenburns:    'kenburns 18s ease-out both',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeUp:  { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(100%)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        pulseSoft: { '0%,100%': { opacity: '0.4' }, '50%': { opacity: '1' } },
        kenburns:  { from: { transform: 'scale(1.08)' }, to: { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}

export default config
