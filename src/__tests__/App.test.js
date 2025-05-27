import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the child components to isolate App component testing
jest.mock('../components/TextForm.jsx', () => {
  return function MockTextForm() {
    return <div data-testid="text-form-component">Text Form Component</div>;
  };
});

jest.mock('../components/TextCloud.jsx', () => {
  return function MockTextCloud() {
    return <div data-testid="text-cloud-component">Text Cloud Component</div>;
  };
});

describe('App Component', () => {
  test('renders the App with all expected components', () => {
    render(<App />);
    
    // Check for the title
    expect(screen.getByText('TWXT')).toBeInTheDocument();
    
    // Check if the child components are rendered
    expect(screen.getByTestId('text-form-component')).toBeInTheDocument();
    expect(screen.getByTestId('text-cloud-component')).toBeInTheDocument();
  });

  test('has the expected background color', () => {
    render(<App />);
    
    // Get the main container (which should have the background color)
    const mainContainer = screen.getByText('TWXT').closest('div');
    
    // Check if the background color is as expected
    expect(mainContainer).toHaveStyle('background-color: #edede1');
  });

  test('title has the correct styles', () => {
    render(<App />);
    
    // Get the title element
    const title = screen.getByText('TWXT');
    
    // Check styles
    expect(title).toHaveClass('text-7xl');
    expect(title).toHaveClass('font-black');
    expect(title).toHaveClass('text-center');
    expect(title).toHaveClass('mb-12');
    expect(title).toHaveClass('tracking-wider');
    expect(title).toHaveClass('uppercase');
    
    // Check color
    expect(title).toHaveStyle('color: #000000');
  });

  test('has correct component hierarchy', () => {
    render(<App />);
    
    // Get the main container
    const mainContainer = screen.getByText('TWXT').closest('div');
    
    // Check that TextForm comes before TextCloud in the DOM
    const textForm = screen.getByTestId('text-form-component');
    const textCloud = screen.getByTestId('text-cloud-component');
    
    // Checking DOM order (comparing positions in the document)
    expect(mainContainer.contains(textForm)).toBe(true);
    expect(mainContainer.contains(textCloud)).toBe(true);
    
    // The compareDocumentPosition method returns a bitmask; 
    // 2 means 'precedes', so this checks if textForm comes before textCloud
    expect(textForm.compareDocumentPosition(textCloud) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});
