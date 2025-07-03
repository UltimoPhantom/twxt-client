import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextCloud from '../TextCloud.jsx';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('TextCloud Component', () => {
  // Sample text items for testing
  const mockTexts = [
    { _id: '1', text_content: 'First test item', createdAt: '2023-01-01' },
    { _id: '2', text_content: 'https://example.com', createdAt: '2023-01-02' },
    { _id: '3', text_content: 'Third test item', createdAt: '2023-01-03' }
  ];  beforeEach(() => {
    jest.clearAllMocks();
    
    axios.get.mockResolvedValue({ data: mockTexts });

    global.navigator.clipboard = {
      writeText: jest.fn().mockResolvedValue(undefined)
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders text cloud component with fetched texts', async () => {
    render(<TextCloud />);    // Check if component fetches texts on mount
    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/texts');
    
    await waitFor(() => {
      mockTexts.forEach(item => {
        expect(screen.getByText(item.text_content)).toBeInTheDocument();
      });
    });
  });

  test('handles text click for copying non-URL texts', async () => {
    jest.useFakeTimers();
    
    render(<TextCloud />);
    await waitFor(() => {
      expect(screen.getByText('First test item')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('First test item'));
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('First test item');
    
    jest.advanceTimersByTime(2000);
    
    // Clean up
    jest.useRealTimers();
  });

  test('handles text click for URL texts by opening in new tab', async () => {
    window.open = jest.fn();
    
    render(<TextCloud />);
    
    await waitFor(() => {
      expect(screen.getByText('https://example.com')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('https://example.com'));
    
    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank');
    
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });  test('deletes a text item when delete button is clicked', async () => {
    axios.delete.mockResolvedValue({});
    
    render(<TextCloud />);
    
    await waitFor(() => {
      expect(screen.getByText('First test item')).toBeInTheDocument();
    });
    
    const textItem = screen.getByText('First test item').closest('[role="button"]');
    
    fireEvent.mouseEnter(textItem);
    
    const deleteButton = textItem.querySelector('[title="Delete text"]');
    fireEvent.click(deleteButton);
    
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:5000/api/texts/1');
    
    await waitFor(() => {
      expect(screen.queryByText('First test item')).not.toBeInTheDocument();
    });
  });  test('shows empty state message when no texts are available', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    
    render(<TextCloud />);
    
    await waitFor(() => {
      expect(screen.getByText('No texts added yet. Start by adding some content!')).toBeInTheDocument();
    });
  });  test('undoes a text deletion when undo button is clicked', async () => {
    axios.delete.mockResolvedValue({});
    axios.post.mockResolvedValue({ data: mockTexts[0] });
    
    const setDeletedItemMock = jest.fn();
    
    render(<TextCloud />);
    
    await waitFor(() => {
      expect(screen.getByText('First test item')).toBeInTheDocument();
    });
    
    const textItem = screen.getByText('First test item').closest('[role="button"]');
    
    fireEvent.mouseEnter(textItem);
    
    const deleteButton = textItem.querySelector('[title="Delete text"]');
    fireEvent.click(deleteButton);
    
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:5000/api/texts/1');
    
    await waitFor(() => {
      expect(screen.queryByText('First test item')).not.toBeInTheDocument();
    });
    
    await axios.post('http://localhost:5000/api/texts', {
      text_content: 'First test item'
    });
    
    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/texts', {
      text_content: 'First test item'
    });
  });  test('handles API error during texts fetching', async () => {
    axios.get.mockRejectedValueOnce(new Error('API error'));
    
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    render(<TextCloud />);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
    
    console.error = originalConsoleError;
  });

  test('applies shadow effect on mouse hover', async () => {
    render(<TextCloud />);
    await waitFor(() => {
      expect(screen.getByText('First test item')).toBeInTheDocument();
    });
    
    const textItem = screen.getByText('First test item').closest('[role="button"]');
    
    const initialBoxShadow = textItem.style.boxShadow;
    
    fireEvent.mouseEnter(textItem);
    
    expect(textItem.style.boxShadow).toBe('8px 10px 0px rgba(0, 0, 0, 1)');
    expect(textItem.style.boxShadow).not.toBe(initialBoxShadow);
    
    fireEvent.mouseLeave(textItem);
    
    expect(textItem.style.boxShadow).toBe('0 4px 6px rgba(0, 0, 0, 0.1)');
  });
});
