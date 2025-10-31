import { Header } from '@/components/Header';
import { PostGrid } from '@/components/PostGrid';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <PostGrid />
      </main>
    </div>
  );
}
