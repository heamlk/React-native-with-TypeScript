import { Config } from 'tailwindcss'
import themeVars from './app/_styles/theme/themeVars'

const config: Config = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    colors: themeVars.colors,
    fontSize: themeVars.fontSize,
    borderRadius: themeVars.borderRadius,
    screens: themeVars.screens,
    extend: {},
  },
  plugins: [require('tailwind-scrollbar-hide')],
}

export default config
