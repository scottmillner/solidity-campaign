import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

// https://testing-library.com/docs/example-react-router
export const renderWithRouter = (ui: ReactElement, route?: string) => {
	window.history.pushState({}, '', route);
	return render(ui, { wrapper: BrowserRouter });
};
