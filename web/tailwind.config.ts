
import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                atom: {
                    green: '#39FF14', // Radioactive green
                    amber: '#FFB400', // CRT yellow/amber
                    teal: '#00CED1',  // Atomic teal
                },
                vault: {
                    navy: '#0A0E1A', // Deep background
                    charcoal: '#111111', // Card background
                    metal: '#1C1F26', // Gunmetal
                    paper: '#E8DCC8', // Off-white text
                    dust: '#B8A88A',  // Muted text
                    rust: '#C45A2C',  // Danger/Rust
                    olive: '#4A5A3C', // Military olive
                }
            },
            fontFamily: {
                mono: ['var(--font-share-tech)', 'monospace'],
                sans: ['var(--font-jost)', 'sans-serif'],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #4A5A3C 1px, transparent 1px), linear-gradient(to bottom, #4A5A3C 1px, transparent 1px)",
                'scanline': "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
                'vignette': "radial-gradient(circle at center, transparent 50%, rgba(0, 0, 0, 0.6) 100%)",
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scan': 'scan 8s linear infinite',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 5px #39FF14)' },
                    '50%': { opacity: '.8', filter: 'drop-shadow(0 0 2px #39FF14)' },
                },
                scan: {
                    '0%': { backgroundPosition: '0% 0%' },
                    '100%': { backgroundPosition: '0% 100%' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
