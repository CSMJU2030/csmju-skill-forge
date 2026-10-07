import type { Config } from 'tailwindcss';

// Palette matches the CSMJU2030 ecosystem-wide design system (see
// standards/ui-design-system.md in csmju-core) so this subsystem's UI stays
// visually consistent with every other module plugged into the Core.
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#004C99',
        'primary-deep': '#0B2D52',
        secondary: '#E6F2FF',
        neutral: '#334155',
        tertiary: '#F8FAFC',
        strength: '#0E7C66',
        developing: '#B7791F',
        gap: '#B4232C',
      },
      fontFamily: {
        display: ['var(--font-chakra)', 'sans-serif'],
        body: ['var(--font-noto-thai)', 'sans-serif'],
      },
      borderRadius: {
        module: '1.25rem',
      },
    },
  },
  plugins: [],
};
export default config;
