/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./views/**/*.html", // Adjust this path based on your frontend templates
    "./public/**/*.js", // Include any JS files in your public folder
    "./src/**/*.jsx", // Add other file types if needed (React, etc.)
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
