/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				'blood-red': '#950740',
				'crimson-glow': '#C3073F',
				'dark-charcoal': '#1A1A1D',
				'silver-crimson': '#6F2232',
				'deep-black': '#000000',
			},
			fontFamily: {
				orbitron: ['Orbitron', 'sans-serif'],
				inter: ['Inter', 'sans-serif'],
			},
			boxShadow: {
				'crimson-inner': 'inset 0 0 10px 2px rgba(195, 7, 63, 0.4)',
				'crimson-outer': '0 0 20px 5px rgba(195, 7, 63, 0.3)',
			},
		},
	},
	// eslint-disable-next-line no-undef
	plugins: [require("daisyui")],
};
