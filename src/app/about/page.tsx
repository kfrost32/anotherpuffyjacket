import { Header } from '@/components/Header';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-2xl mx-auto px-6 sm:px-8 py-12">
        <h2 className="text-xs font-light tracking-widest text-gray-900 uppercase mb-6">
          About
        </h2>
        <div className="text-sm font-light text-gray-600 leading-relaxed space-y-4">
          <p>Coming soon.</p>
        </div>
      </main>
    </div>
  );
}
