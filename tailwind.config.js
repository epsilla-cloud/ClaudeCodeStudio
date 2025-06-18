/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#1e1e1e',
        'bg-secondary': '#252526',
        'bg-chat': '#1e1e1e',
        'msg-user': '#0e4429',
        'msg-assistant': '#1f2937',
        'accent': '#007acc',
        'text-primary': '#cccccc',
        'text-secondary': '#969696'
      }
    },
  },
  plugins: [],
}