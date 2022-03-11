import { screen } from '@testing-library/react';
import { App } from '../App';
import { PathName } from '../types';
import { renderWithRouter } from './testhelper';

describe('<App />', () => {
	it('displays <App />', () => {
		// Act
		renderWithRouter(<App />, PathName.Home);

		// Assert
		const mainDiv = screen.getByText('Home');
		expect(mainDiv).toBeInTheDocument();
	});
});
