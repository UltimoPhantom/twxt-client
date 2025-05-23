import TextForm from './components/TextForm.jsx';
import TextCloud from './components/TextCloud.jsx';

export default function App() {
  return (
    <div 
      className="min-h-screen p-8"
      style={{ backgroundColor: '#2a2a28' }}
    >
      <h1 className="text-7xl font-black text-center text-gray-100 mb-12 tracking-wider
                     drop-shadow-2xl bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 
                     bg-clip-text text-transparent uppercase font-serif">
        TWXT
      </h1>
      <TextForm />
      <TextCloud />
    </div>
  );
}