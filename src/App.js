import TextForm from './components/TextForm.jsx';
import TextCloud from './components/TextCloud.jsx';

export default function App() {
  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#edede1' }}>
      <h1
        className="text-7xl font-black text-center mb-12 tracking-wider uppercase"
        style={{
          fontFamily: 'Suisse Intl, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
          color: '#000000'
        }}
      >
        TWXT
      </h1>
      <TextForm />
      <TextCloud />
    </div>
  );
}
