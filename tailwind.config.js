import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1200px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Retro CRT accents (raw, usable directly e.g. text-amber-crt)
        amber: {
          crt: '#ffb000',
          dim: '#b87900',
        },
        phosphor: {
          DEFAULT: '#5cf2a0',
          dim: '#2fae72',
        },
        cyber: {
          pink: '#ff5c8a',
          cyan: '#56c8ff',
        },
        ink: {
          950: '#0a0a0c',
          900: '#0f0f12',
          850: '#141418',
          800: '#1b1b21',
          700: '#26262e',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        // Hard, no blur — pixel/retro lift
        pixel: '4px 4px 0 0 hsl(var(--border))',
        'pixel-amber': '4px 4px 0 0 #ffb000',
        'pixel-phosphor': '4px 4px 0 0 #5cf2a0',
        glow: '0 0 0 1px #ffb000, 0 0 18px -2px rgba(255,176,0,0.45)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.92' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        flicker: 'flicker 4s infinite',
        scan: 'scan 6s linear infinite',
        blink: 'blink 1.1s step-end infinite',
      },
    },
  },
  plugins: [animate],
}
