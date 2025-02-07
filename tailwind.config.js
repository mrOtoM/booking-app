module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Roboto, sans-serif'],
    },
    extend: {
      colors: {
        'border-color-light': '#d1d5db', // gray-300
        'background-primary': '#eff3f8',
        'background-card': '#ffffff',
        'background-topbar': '#ffffff',
        'text-primary': '#495057',
        'text-secondary': '#6c757d',
        'text-test': '#872b7d',
      },
      height: {
        screen: '100dvh',
      },
    },
  },
  plugins: [],
};

