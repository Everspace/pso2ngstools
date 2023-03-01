/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-roboto-flex)"],
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
}
