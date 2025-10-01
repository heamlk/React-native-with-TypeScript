/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    colors: {
      dark1: '#1a1425',
      dark2: '#281f36',
      dark3: '#3e2f57',
      dark4: '#48315e',
      dark5: '#291e3c',
      dark6: '#1f182b',
      dark7: '#20192c',
      light1: '#ffffff',
      light2: '#ebe1f4',
      light3: '#ddc6f1',
      light4: '#c3bad2',
      light5: '#a797c2',
      purple1: '#860fef',
      purple2: '#927ab9',
      purple3: '#aa4aff',
      purple4: '#866faa',
      purple5: '#7e6f8e',
      red1: '#ed114c',
      green1: '#0fab4b',
      yellow1: '#febe44',

      opacity20: '33',
      opacity40: '66',
      opacity70: 'b3',
      opacity80: 'cc',

      white: '#ffffff',
      black: '#000000',
      grey1: '#424753',
      grey2: '#737987',
      grey3: '#8990a1',
      grey4: '#979ba5',
      grey5: '#cdd2de',
      grey6: '#e8e9ed',
    },

    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '20px',
      xl: '26px',
      '2xl': '1px',
      '3xl': '1px',
      '4xl': '1px',
      '5xl': '1px',
    },

    borderRadius: {
      xs: 6,
      sm: 10,
      md: 24,
    },

    extend: {},
  },
  plugins: [],
}
