import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TextCloud() {
  const [texts, setTexts] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deletedItem, setDeletedItem] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);

  const customStyles = `
    @keyframes slide-up {
      from {
        transform: translate(-50%, 100%);
        opacity: 0;
      }
      to {
        transform: translate(-50%, 0%);
        opacity: 1;
      }
    }
    .animate-slide-up {
      animation: slide-up 0.3s ease-out;
    }
  `;

  const fetchTexts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/texts');
      const sortedTexts = res.data.sort(
        (a, b) =>
          new Date(b.added_date || b.createdAt || b._id) -
          new Date(a.added_date || a.createdAt || a._id)
      );
      setTexts(sortedTexts);
    } catch (error) {
      console.error('Error fetching texts:', error);
    }
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
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const deleteText = async (id, e) => {
    e.stopPropagation();
    try {
      setDeletingId(id);

      const itemToDelete = texts.find((t) => t._id === id);

      setTexts(texts.filter((t) => t._id !== id));

      await axios.delete(`http://localhost:5000/api/texts/${id}`);

      setDeletedItem(itemToDelete);

      if (undoTimer) {
        clearTimeout(undoTimer);
      }

      const timer = setTimeout(() => {
        setDeletedItem(null);
      }, 5000);
      setUndoTimer(timer);
    } catch (err) {
      console.error('Failed to delete text: ', err);
      fetchTexts();
    } finally {
      setDeletingId(null);
    }
  };

  const undoDelete = async () => {
    if (!deletedItem) return;

    try {
      if (undoTimer) {
        clearTimeout(undoTimer);
        setUndoTimer(null);
      }

      const response = await axios.post('http://localhost:5000/api/texts', {
        text_content: deletedItem.text_content,
      });

      setTexts((prevTexts) => [response.data, ...prevTexts]);

      setDeletedItem(null);
    } catch (err) {
      console.error('Failed to undo delete: ', err);
    }
  };

  const handleItemClick = (text, id) => {
    if (isUrl(text)) {
      window.open(text, '_blank');
    } else {
      copyToClipboard(text, id);
    }
  };

  const handleTextAdded = async (event) => {
    if (event.detail && event.detail.newText) {
      setTexts((prevTexts) => [event.detail.newText, ...prevTexts]);
    } else {
      fetchTexts();
    }
  };

  useEffect(() => {
    fetchTexts();

    window.addEventListener('text-added', handleTextAdded);

    return () => {
      window.removeEventListener('text-added', handleTextAdded);
      if (undoTimer) {
        clearTimeout(undoTimer);
      }
    };
  }, []);

  return (
    <>
      <style>{customStyles}</style>
      <div
        className="min-h-screen p-4 md:p-8"
        style={{ backgroundColor: '#edede1' }}
      >
        <div
          className="flex flex-wrap gap-8 w-full"
          style={{ justifyContent: 'flex-start' }}
        >
          {deletedItem && (
            <div
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50
                          bg-gray-800 text-white px-6 py-3 shadow-xl
                          flex items-center gap-3 animate-slide-up"
              style={{ borderRadius: '0' }}
            >
              <span className="text-lg font-medium">Text deleted</span>
              <button
                onClick={undoDelete}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
                         transition-colors duration-200 focus:outline-none 
                         focus:ring-2 focus:ring-blue-300 text-base font-medium"
                style={{ borderRadius: '0' }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                  ></path>
                </svg>
                Undo
              </button>
            </div>
          )}

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
                group relative px-8 py-6 cursor-pointer
                transition-all duration-200 ease-in-out
                hover:-translate-x-1
                focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50
                ${copiedId === t._id ? 'animate-pulse' : ''}
              `}
              style={{
                backgroundColor: copiedId === t._id ? '#edede1' : '#edede1',
                width: 'auto',
                maxWidth: '90%',
                borderRadius: '0px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition:
                  'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
                fontFamily:
                  'Suisse Intl, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '8px 10px 0px rgba(0, 0, 0, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <button
                onClick={(e) => deleteText(t._id, e)}
                disabled={deletingId === t._id}
                className="absolute top-3 right-3 p-2
                         opacity-0 group-hover:opacity-100
                         transition-opacity duration-200
                         focus:opacity-100 focus:outline-none
                         disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderRadius: '0',
                  backgroundColor: '#edede1',
                  border: '1px solid #000000',
                }}
                title="Delete text"
              >
                {deletingId === t._id ? (
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#000000"
                    strokeWidth="2"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="#000000" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                )}
              </button>

              {/* Popup removed as requested */}

              <div
                className="text-3xl font-bold leading-relaxed break-words text-gray-700"
                style={{
                  fontFamily:
                    'Suisse Intl, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
                  display: 'inline-block', // Display as inline-block to size based on content
                  maxWidth: '100%', // Ensure it doesn't overflow its container
                }}
              >
                {isUrl(t.text_content) ? (
                  <div className="flex items-center gap-4">
                    <svg
                      className="w-8 h-8 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z"></path>
                    </svg>
                    <span className="truncate font-mono text-2xl">
                      {t.text_content}
                    </span>
                  </div>
                ) : (
                  t.text_content
                )}
              </div>

              {copiedId === t._id && (
                <div className="absolute top-2 right-2">
                  <svg
                    className="w-5 h-5 text-gray-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {texts.length === 0 && !deletedItem && (
          <div
            className="text-center text-gray-400 text-2xl mt-20"
            style={{
              fontFamily:
                'Suisse Intl, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
            }}
          >
            No texts added yet. Start by adding some content!
          </div>
        )}
      </div>
    </>
  );
}
