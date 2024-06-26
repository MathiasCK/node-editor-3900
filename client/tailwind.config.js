/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  purge: {
    safelist: [
      'border-connected',
      'text-connected',
      'bg-connected',
      'bg-function-light',
      'bg-function-dark',
      'bg-product-light',
      'bg-product-dark',
      'bg-location-light',
      'bg-location-dark',
      'bg-empty-light',
      'bg-empty-dark',
      'text-function-foreground-light',
      'text-function-foreground-dark',
      'text-product-foreground-light',
      'text-empty-foreground-light',
      'text-product-foreground-dark',
      'text-location-foreground-light',
      'text-location-foreground-dark',
      'text-empty-foreground-dark',
    ],
  },
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        consolas: ['Consolas', 'Monaco', 'monospace'],
      },
      colors: {
        'navbar-dark': '#0a0a0a',
        block: '#ff5f5f',
        connector: '#5f5fff',
        terminal: '#5fff5f',
        fulfilled: '#fcd34c',
        connected: '#bfdbfe',
        part: '#4ade80',
        transfer: '#60a5fa',
        'function-light': '#ffff00',
        'product-light': '#7df9ff',
        'location-light': '#ff6ec7',
        'empty-light': '#15202b',
        'function-dark': '#ffff00',
        'product-dark': '#7df9ff',
        'location-dark': '#ff6ec7',
        'empty-dark': '#d1d5db',
        'function-foreground-light': '#000000',
        'product-foreground-light': '#000000',
        'location-foreground-light': '#000000',
        'empty-foreground-light': '#d1d5db',
        'function-foreground-dark': '#000000',
        'product-foreground-dark': '#000000',
        'location-foreground-dark': '#000000',
        'empty-foreground-dark': '#15202b',
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
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
