/* eslint-disable import/no-commonjs */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{html,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}

