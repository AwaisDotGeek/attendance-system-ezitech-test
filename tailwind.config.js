module.exports = {
  purge: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, 
  theme: {
    extend: {
      colors: {
        black_one: '#414a4c',
        black_two: '#3b444b',
        black_three: '#353839',
        black_four: '#232b2b',
        black_five: '#0e1111',
      },
    },
  },
  variants: {
    extend: {
    },
  },
  plugins: [],
}

