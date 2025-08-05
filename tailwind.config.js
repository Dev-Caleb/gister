/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{html,js}"], // Scan index.html and src/ for Tailwind classes
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED', // Vibrant purple for branding
        accent: '#10B981', // Bright green for Nigerian flair
        glass: 'rgba(255, 255, 255, 0.1)', // Frosted glass for light mode
        'glass-dark': 'rgba(31, 41, 55, 0.2)', // Frosted glass for dark mode
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.backdrop-blur-xs': {
          'backdrop-filter': 'blur(2px)',
        },
        '.backdrop-blur-sm': {
          'backdrop-filter': 'blur(4px)',
        },
        '.backdrop-blur-md': {
          'backdrop-filter': 'blur(8px)',
        },
      });
    },
  ],
}