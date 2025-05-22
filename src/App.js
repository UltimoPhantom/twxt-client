import TextForm from './components/TextForm';
import TextCloud from './components/TextCloud';

export default function App() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-100 to-indigo-100">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        Text Cloud
      </h1>
      <TextForm />
      <TextCloud />
    </div>
  );
}
