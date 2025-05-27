import { useState } from 'react';
import axios from 'axios';

export default function TextForm() {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/texts', {
        text_content: text,
      });
      setText('');

      window.dispatchEvent(
        new CustomEvent('text-added', {
          detail: { newText: response.data },
        })
      );
    } catch (error) {
      console.error('Error adding text:', error);
      window.dispatchEvent(new Event('text-added'));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center mb-16 px-4"
    >
      <div className="flex w-full max-w-5xl shadow-2xl overflow-hidden" style={{ borderRadius: '0', width: '95%' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text or URL..."
          className="p-5 w-full text-lg text-gray-800 
                   placeholder-gray-500 focus:outline-none
                   transition-colors duration-200"
          style={{
            fontFamily: 'Suisse Intl, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
            borderRadius: '0',
            backgroundColor: '#edede1'
          }}
        />
        <button
          type="submit"
          className="px-5 py-5 text-gray-800
                   focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
                   transition-all duration-200 transform hover:scale-105
                   active:scale-95 flex items-center justify-center"
          style={{
            fontFamily: 'Suisse Intl, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
            borderRadius: '0',
            backgroundColor: '#edede1',
            width: '64px'
          }}
          title="Add Text"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            style={{ transform: 'scale(1.2)' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
