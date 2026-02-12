/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'retro-brown': '#562717',
        'retro-red': '#C21717',
        'retro-orange': '#E76219',
        'retro-yellow': '#FEA712',
        'retro-cream': '#FDDCA9',
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',
        'surface-1': 'var(--color-surface-1)',
        'surface-2': 'var(--color-surface-2)',
        'surface-3': 'var(--color-surface-3)',
        'surface-hover': 'var(--color-surface-hover)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'accent-red': 'var(--color-accent-red)',
        'accent-blue': 'var(--color-accent-blue)',
        'accent-cream': 'var(--color-accent-cream)',
        'accent-gold': 'var(--color-accent-gold)',
        'accent-cyan': 'var(--color-accent-cyan)',
        'product-receptionist': 'var(--color-product-receptionist)',
        'product-prompt': 'var(--color-product-prompt)',
        'product-type': 'var(--color-product-type)',
        'product-leads': 'var(--color-product-leads)',
        'product-consulting': 'var(--color-product-consulting)',
        'product-clearpix': 'var(--color-product-clearpix)',
        'state-success': 'var(--color-state-success)',
        'state-warning': 'var(--color-state-warning)',
        'state-error': 'var(--color-state-error)',
        'state-info': 'var(--color-state-info)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      keyframe: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(1deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        sweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' }
        }
      },
      animation: {
        aurora: 'aurora 15s ease infinite',
        float: 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        sweep: 'sweep 3s linear infinite',
      }
    },
  },
  plugins: [],
}
