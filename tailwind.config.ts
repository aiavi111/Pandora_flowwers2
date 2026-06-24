import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pandora: {
          cream:       '#FFF8FB',
          black:       '#0D0D0D',
          dark:        '#111111',
          rose:        '#B8829A',
          'rose-light':'#E2ABBE',
          blush:       '#FBE8EE',
          gold:        '#C9A85C',
          'gold-light':'#E8D4A0',
          pink:        '#F2C8D6',
          text:        '#1A1A1A',
          muted:       '#888888',
          border:      '#F0E4EA',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':  'linear-gradient(135deg, #0D0D0D 0%, #1A1018 50%, #0D0D0D 100%)',
        'rose-gradient':  'linear-gradient(135deg, #B8829A 0%, #E2ABBE 100%)',
        'blush-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FBE8EE 100%)',
        'gold-gradient':  'linear-gradient(135deg, #C9A85C 0%, #E8D4A0 100%)',
      },
      animation: {
        'fade-in':      'fadeIn 0.6s ease-out',
        'slide-up':     'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'luxury':     '0 4px 40px rgba(184, 130, 154, 0.18)',
        'card':       '0 2px 16px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}

export default config
