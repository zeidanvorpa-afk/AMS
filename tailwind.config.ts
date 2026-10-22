import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
        pink: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
        gray: {
          400: '#9ca3af',
          500: '#6b7280',
        },
        green: {
          400: '#4ade80',
          500: '#22c55e',
        },
        red: {
          400: '#f87171',
          500: '#ef4444',
        },
        blue: {
          400: '#60a5fa',
          500: '#3b82f6',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        yellow: {
          400: '#facc15',
          500: '#eab308',
        },
        orange: {
          400: '#fb923c',
          500: '#f97316',
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
        },
        indigo: {
          500: '#6366f1',
        },
      },
      animation: {
        blob: 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
