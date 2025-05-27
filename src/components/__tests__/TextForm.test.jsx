import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextForm from '../TextForm.jsx';
import axios from 'axios';

// Ensure axios is properly mocked
jest.mock('axios');

describe('TextForm Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock window.dispatchEvent since we'll be testing it
    window.dispatchEvent = jest.fn();
  });

  test('renders the text input form correctly', () => {
    render(<TextForm />);
    
    // Check if input field exists
    const inputField = screen.getByPlaceholderText('Enter your text or URL...');
    expect(inputField).toBeInTheDocument();
    
    // Check if submit button (plus sign) exists
    const submitButton = screen.getByTitle('Add Text');
    expect(submitButton).toBeInTheDocument();
  });

  test('allows users to type in the input field', () => {
    render(<TextForm />);
    
    // Get the input field
    const inputField = screen.getByPlaceholderText('Enter your text or URL...');
    
    // Simulate typing in the input field
    fireEvent.change(inputField, { target: { value: 'Test text' } });
    
    // Check if the input field has the updated value
    expect(inputField.value).toBe('Test text');
  });  test('submits text when the form is submitted', async () => {
    // Mock successful API response
    const mockResponse = { data: { _id: '123', text_content: 'Test text' } };
    axios.post.mockResolvedValueOnce(mockResponse);
    
    render(<TextForm />);
    
    // Get the input field and submit button
    const inputField = screen.getByPlaceholderText('Enter your text or URL...');
    const submitButton = screen.getByTitle('Add Text');
    
    // Type in the input field
    fireEvent.change(inputField, { target: { value: 'Test text' } });
    
    // Submit the form by clicking the button
    fireEvent.click(submitButton);
    
    // Check if axios.post was called with the correct arguments
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/texts', {
        text_content: 'Test text',
      });
    });
    
    // Wait for the input field to be cleared after submission
    await waitFor(() => {
      expect(inputField.value).toBe('');
    });
    
    // Check if event was dispatched
    expect(window.dispatchEvent).toHaveBeenCalled();
  });

  test('handles form submission when input is empty', () => {
    render(<TextForm />);
    
    // Get the submit button
    const submitButton = screen.getByTitle('Add Text');
    
    // Submit the form without typing anything
    fireEvent.click(submitButton);    // Check that axios.post was not called
    expect(axios.post).not.toHaveBeenCalled();
  });  test('handles API error during form submission', async () => {
    // Mock API error
    axios.post.mockRejectedValueOnce(new Error('API error'));
    
    // Set up console.error mock to avoid cluttering test output
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    render(<TextForm />);
    
    // Get the input field and submit button
    const inputField = screen.getByPlaceholderText('Enter your text or URL...');
    const submitButton = screen.getByTitle('Add Text');
    
    // Type in the input field
    fireEvent.change(inputField, { target: { value: 'Test text' } });
    
    // Submit the form
    fireEvent.click(submitButton);    // Check if axios.post was called
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/texts', {
        text_content: 'Test text',
      });
    });
    
    // Check if error was logged
    expect(console.error).toHaveBeenCalled();
    
    // Check if event was still dispatched despite error
    expect(window.dispatchEvent).toHaveBeenCalled();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
});
