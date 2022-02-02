module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				Inter: ['Inter', 'sans-serif'],
			},
			borderRadius: {
				5: '5px',
				15: '15px',
			},
			colors: {
				gray: '#F2F5F9',
				'dark-gray': '#DEE3EA',
				'input-gray': '#EDEEF2',
				'placeholder-gray': '#C4C4C4',
				'helpertext-gray': '#707070',
				aqua: '#11B4BF',
				'landing-page': '#027380',
				'table-text-color': '#0A0B0D',
				'light-aqua': '#DBECED',
				green: '#66BE26',
			},
		},
	},
	plugins: [],
};
