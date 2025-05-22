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
      className="flex items-center justify-center mb-6"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text..."
        className="p-3 w-full max-w-md rounded-l-lg border border-gray-300 shadow-sm focus:outline-none"
      />
      <button
        type="submit"
        className="bg-indigo-500 text-white px-4 py-3 rounded-r-lg hover:bg-indigo-600"
      >
        Add
      </button>
    </form>
  );
}
