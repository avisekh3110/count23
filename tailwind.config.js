/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors:{
        primary:"#0d47a1",
        secondary: "#270082",
        tertiary: "#6f6ff3",
        quaternary: "#5534A5",
      },
      height: {
        nonav: "calc(100vh - 3.5rem)",
      },
      minHeight: {
        nonav: "calc(100vh - 3.5rem)",
      }
    },
  },
  plugins: [],
}
