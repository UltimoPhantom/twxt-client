import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TextCloud() {
  const [texts, setTexts] = useState([]);

  const fetchTexts = async () => {
    const res = await axios.get('http://localhost:5000/api/texts');
    setTexts(res.data);
  };

  useEffect(() => {
    fetchTexts();
    window.addEventListener('text-added', fetchTexts);
    return () => window.removeEventListener('text-added', fetchTexts);
  }, []);

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {texts.map((t) => (
        <div
          key={t._id}
          className="bg-white px-4 py-2 rounded-full shadow text-sm text-gray-800 hover:bg-indigo-100 transition"
        >
          {t.text_content}
        </div>
      ))}
    </div>
  );
}
