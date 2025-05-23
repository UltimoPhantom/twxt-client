import { useState } from 'react';
import axios from 'axios';

export default function TextForm() {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await axios.post('http://localhost:5000/api/texts', { text_content: text });
    setText('');
    window.dispatchEvent(new Event('text-added')); // trigger reload
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center mb-16 px-4"
    >
      <div className="flex w-full max-w-3xl shadow-2xl rounded-2xl overflow-hidden">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text or URL..."
          className="p-5 w-full text-lg text-gray-800 bg-gray-100 
                   placeholder-gray-500 focus:outline-none focus:bg-white
                   transition-colors duration-200 font-mono"
        />
        <button
          type="submit"
          className="px-10 py-5 text-2xl font-semibold text-white
                   bg-gradient-to-r from-blue-600 to-blue-700
                   hover:from-blue-500 hover:to-blue-600
                   focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
                   transition-all duration-200 transform hover:scale-105
                   active:scale-95 font-mono"
        >
          Add Text
        </button>
      </div>
    </form>
  );
}