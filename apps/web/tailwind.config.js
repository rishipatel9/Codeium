module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': ' radial-gradient(circle, rgba(255,255,255,1) 37%, rgba(207,207,249,1) 100%)',
      },
    },
  },
  plugins: [],
}