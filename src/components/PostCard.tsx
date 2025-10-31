'use client';

import { Post } from '@/types/database';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
  type: 'product' | 'commentary';
  index: number;
}

export function PostCard({ post, type, index }: PostCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  if (type === 'product') {
    return (
      <div
        ref={ref}
        style={{ transitionDelay: isVisible ? `${index * 30}ms` : '0ms' }}
        className={`group relative flex flex-col transition-all duration-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
        }`}
      >
        <div className="relative">
          <Link href={`/post/${post.id}`}>
            <div className="w-full overflow-hidden">
              <Image
                src={post.feature_image}
                alt={post.name}
                width={800}
                height={1067}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </Link>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-100 scale-90 z-10"
          >
            <ArrowUpRight className="h-4 w-4 text-gray-900" />
          </a>
        </div>
        <div className="p-4 flex items-center justify-between min-h-[100px] transition-opacity duration-300 group-hover:opacity-70">
          <Link href={`/post/${post.id}`} className="flex flex-col justify-center space-y-1 flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm leading-tight uppercase tracking-wide truncate">
              {post.name}
            </h3>
            <div className="text-xs uppercase tracking-wide text-gray-500">
              {post.brand}
            </div>
            {post.price && (
              <div className="text-xs font-medium text-gray-900 uppercase tracking-wide">
                ${post.price}
              </div>
            )}
          </Link>
        </div>
      </div>
    );
  }

  return null;
}