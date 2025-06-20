import { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export default function TextForm() {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const response = await axios.post(API_ENDPOINTS.TEXTS, {
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
      <div
        className="flex w-full max-w-5xl shadow-2xl overflow-hidden"
        style={{ borderRadius: '0', width: '95%' }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="p-5 w-full text-3xl font-bold leading-relaxed text-gray-700 
                   focus:outline-none"
          style={{
            fontFamily:
              'Suisse Intl, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
            borderRadius: '0',
            backgroundColor: '#edede1',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s ease',
          }}
        />
        <button
          type="submit"
          className="px-5 py-5 text-gray-800
                   focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
                   transition-all duration-200 transform hover:scale-105
                   active:scale-95 flex items-center justify-center"
          style={{
            fontFamily:
              'Suisse Intl, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
            borderRadius: '0',
            backgroundColor: '#edede1',
            width: '64px',
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
