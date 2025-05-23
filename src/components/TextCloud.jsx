import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TextCloud() {
  const [texts, setTexts] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const fetchTexts = async () => {
    const res = await axios.get('http://localhost:5000/api/texts');
    setTexts(res.data);
  };

  const isUrl = (text) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleItemClick = (text, id) => {
    if (isUrl(text)) {
      window.open(text, '_blank');
    } else {
      copyToClipboard(text, id);
    }
  };

  useEffect(() => {
    fetchTexts();
    window.addEventListener('text-added', fetchTexts);
    return () => window.removeEventListener('text-added', fetchTexts);
  }, []);

  return (
    <div 
      className="min-h-screen p-8"
      style={{ backgroundColor: '#2a2a28' }}
    >
      <div className="flex flex-wrap gap-8 justify-center max-w-7xl mx-auto">
        {texts.map((t) => (
          <div
            key={t._id}
            role="button"
            tabIndex={0}
            onClick={() => handleItemClick(t.text_content, t._id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleItemClick(t.text_content, t._id);
              }
            }}
            className={`
              relative px-14 py-10 rounded-2xl shadow-lg cursor-pointer
              transform transition-all duration-200 ease-in-out
              hover:scale-102 hover:shadow-xl
              focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
              ${copiedId === t._id ? 'animate-pulse' : ''}
              ${isUrl(t.text_content) 
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600' 
                : 'hover:from-gray-700 hover:to-gray-600'
              }
            `}
            style={{ 
              backgroundColor: copiedId === t._id ? '#4ade80' : '#f5f5f0',
              maxWidth: '600px',
              minWidth: '350px'
            }}
          >
            {/* Hover tooltip */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 
                          bg-gray-800 text-white px-3 py-1 rounded-lg text-sm
                          opacity-0 hover:opacity-100 transition-opacity duration-200
                          pointer-events-none z-10">
              {copiedId === t._id 
                ? 'Copied!' 
                : isUrl(t.text_content) 
                  ? 'Click to open' 
                  : 'Click to copy'
              }
            </div>

            {/* Content */}
            <div className={`
              text-3xl font-bold leading-relaxed break-words font-serif
              ${isUrl(t.text_content) ? 'text-white' : 'text-gray-700'}
              ${copiedId === t._id ? 'text-gray-800' : ''}
            `}>
              {isUrl(t.text_content) ? (
                <div className="flex items-center gap-4">
                  <svg className="w-8 h-8 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z"></path>
                  </svg>
                  <span className="truncate font-mono text-2xl">{t.text_content}</span>
                </div>
              ) : (
                t.text_content
              )}
            </div>

            {/* Copy indicator */}
            {copiedId === t._id && (
              <div className="absolute top-2 right-2">
                <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
            )}

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-20 
                          bg-gradient-to-r from-transparent via-white to-transparent
                          transform -skew-x-12 -translate-x-full
                          transition-transform duration-700 hover:translate-x-full">
            </div>
          </div>
        ))}
      </div>

      {texts.length === 0 && (
        <div className="text-center text-gray-400 text-2xl mt-20">
          No texts added yet. Start by adding some content!
        </div>
      )}
    </div>
  );
}