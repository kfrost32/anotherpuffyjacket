import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/types/database';
import Image from 'next/image';
import Link from 'next/link';

interface ChatMessageProps {
  post: Post;
  type: 'product' | 'commentary';
}

export function ChatMessage({ post, type }: ChatMessageProps) {
  if (type === 'product') {
    return (
      <div className="flex justify-start mb-4">
        <Card className="w-full max-w-sm sm:max-w-md p-4 bg-gray-100 rounded-lg rounded-bl-none">
          <Link href={`/post/${post.id}`} className="block">
            <div className="relative h-40 sm:h-48 w-full mb-3 rounded-lg overflow-hidden">
              <Image
                src={post.feature_image}
                alt={post.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {post.brand}
                </Badge>
                {post.price && (
                  <span className="text-base sm:text-lg font-bold text-green-600">
                    ${post.price}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                {post.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">
                {post.description}
              </p>
            </div>
          </Link>
        </Card>
      </div>
    );
  }

  if (type === 'commentary' && post.short_commentary) {
    return (
      <div className="flex justify-end mb-4">
        <Card className="w-full max-w-sm sm:max-w-md p-3 bg-blue-500 text-white rounded-lg rounded-br-none">
          <p className="text-xs sm:text-sm">{post.short_commentary}</p>
        </Card>
      </div>
    );
  }

  return null;
}