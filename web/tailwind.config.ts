
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
                bg: {
                    primary: '#0B0B14',
                    secondary: '#111122',
                    tertiary: '#161628',
                },
                surface: {
                    1: '#1A1A2E',
                    2: '#222240',
                    3: '#2A2A4A',
                    hover: '#32325A',
                },
                text: {
                    primary: '#EAEAF0',
                    secondary: '#A8A8C0',
                    muted: '#6B6B88',
                },
                accent: {
                    red: '#E63946',
                    blue: '#4895EF',
                    cream: '#F5E6D3',
                    gold: '#F0B429',
                    cyan: '#4CC9F0',
                },
                product: {
                    receptionist: '#0D7377',
                    prompt: '#7C3AED',
                    type: '#FF6B6B',
                    leads: '#10B981',
                    consulting: '#1E3A5F',
                    clearpix: '#EC4899',
                },
                state: {
                    success: '#34D399',
                    warning: '#FBBF24',
                    error: '#F87171',
                    info: '#60A5FA',
                }
            },
            fontFamily: {
                display: ['var(--font-display)', 'sans-serif'],
                body: ['var(--font-body)', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
            },
            keyframes: {
                aurora: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
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
                    '100%': { transform: 'translateX(200%)' },
                }
            },
            animation: {
                aurora: 'aurora 15s ease infinite',
                float: 'float 6s ease-in-out infinite',
                'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
                sweep: 'sweep 3s linear infinite',
            },
        },
    },
    plugins: [],
};
export default config;
