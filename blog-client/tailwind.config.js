// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                abril: ["Abril Fatface", "serif"], // Add Abril Fatface
                jost: ["Jost", "sans-serif"], // Add Jost
            },
        },
    },
    plugins: [],
};