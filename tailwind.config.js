/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        green: {
          50: '#F1F8F5',
          100: '#E8F5E9',
          200: '#C8E6C9',
          600: '#43A047',
          700: '#2E7D32',
          800: '#1B5E20',
        },
        background: '#F5F7F4',
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.08)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
