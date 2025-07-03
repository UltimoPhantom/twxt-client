import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextForm from '../TextForm.jsx';
import axios from 'axios';

jest.mock('axios');

describe('TextForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    window.dispatchEvent = jest.fn();
  });
  test('renders the text input form correctly', () => {
    render(<TextForm />);
    
    const inputField = screen.getByRole('textbox');
    expect(inputField).toBeInTheDocument();
    
    const submitButton = screen.getByTitle('Add Text');
    expect(submitButton).toBeInTheDocument();
  });
  test('allows users to type in the input field', () => {
    render(<TextForm />);
    
    const inputField = screen.getByRole('textbox');
    
    fireEvent.change(inputField, { target: { value: 'Test text' } });
    
    expect(inputField.value).toBe('Test text');
  });  test('submits text when the form is submitted', async () => {
    const mockResponse = { data: { _id: '123', text_content: 'Test text' } };
    axios.post.mockResolvedValueOnce(mockResponse);
    
    render(<TextForm />);
    
    const inputField = screen.getByRole('textbox');
    const submitButton = screen.getByTitle('Add Text');
    
    fireEvent.change(inputField, { target: { value: 'Test text' } });
    
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      const call = axios.post.mock.calls[0];
      expect(call[1]).toEqual({ text_content: 'Test text' });
    });
    
    await waitFor(() => {
      expect(inputField.value).toBe('');
    });
    
    expect(window.dispatchEvent).toHaveBeenCalled();
  });

  test('handles form submission when input is empty', () => {
    render(<TextForm />);
    
    const submitButton = screen.getByTitle('Add Text');
    
    fireEvent.click(submitButton);
    expect(axios.post).not.toHaveBeenCalled();
  });  test('handles API error during form submission', async () => {
    axios.post.mockRejectedValueOnce(new Error('API error'));
    
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    render(<TextForm />);
    
    const inputField = screen.getByRole('textbox');
    const submitButton = screen.getByTitle('Add Text');
    
    fireEvent.change(inputField, { target: { value: 'Test text' } });
    
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/texts', {
        text_content: 'Test text',
      });
    });
    
    expect(console.error).toHaveBeenCalled();
    
    expect(window.dispatchEvent).toHaveBeenCalled();
    
    console.error = originalConsoleError;
  });
});
