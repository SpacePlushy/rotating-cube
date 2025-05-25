import "@testing-library/jest-dom";
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../src/App';

describe('App', () => {
  it('renders and toggles light mode button', () => {
    render(<App />);
    const toggle = screen.getByTestId('light-mode-toggle');
    expect(toggle).toBeInTheDocument();
    expect(toggle.textContent).toMatch(/Light Mode|Dark Mode/);
    const textBefore = toggle.textContent;
    fireEvent.click(toggle);
    expect(toggle.textContent).not.toBe(textBefore);
  });
});
