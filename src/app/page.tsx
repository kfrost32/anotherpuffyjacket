import { ChatFeed } from '@/components/ChatFeed';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Another Puffy Jacket
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Curated outdoor gear discoveries
          </p>
        </div>
      </header>
      
      <main>
        <ChatFeed />
      </main>
    </div>
  );
}
