/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        block: "#ff5f5f",
        connector: "#5f5fff",
        terminal: "#5fff5f",
      },
      fontFamily: {
        consolas: ["Consolas", "Monaco", "monospace"],
      },
    },
  },
  plugins: [],
};
