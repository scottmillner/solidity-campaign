import { render, screen } from '@testing-library/react';
import { App } from '../App';

describe('<App />', () => {
	it('displays <Main />', () => {
		// Act
		render(<App />);

		// Assert
		const mainDiv = screen.getByText('HOME');
		expect(mainDiv).toBeInTheDocument();
	});
});
