import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import Home from 'src/pages/index';

describe('Home', () => {
  it('renders a heading', () => {
    // Arrange
    render(<Home />);

    // Act
    const heading = screen.getByRole('heading', {
      name: 'Welcome to Five Club',
    });

    // Assert
    expect(heading).toBeInTheDocument();
  });
});
