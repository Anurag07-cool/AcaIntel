export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#06B6D4',
        accent: '#8B5CF6',
        dark: '#0F172A',
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        acaintel: {
          "primary": "#2563EB",
          "secondary": "#06B6D4",
          "accent": "#8B5CF6",
          "neutral": "#1f2937",
          "base-100": "#0F172A",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
}
