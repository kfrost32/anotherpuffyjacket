'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Post } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function PostDetail() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string);
    }
  }, [params.id]);

  const fetchPost = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        return;
      }

      setPost(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col justify-center items-center h-64">
          <h1 className="text-sm font-medium text-gray-900 mb-6">Post not found</h1>
          <Link href="/">
            <Button variant="ghost" size="sm">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-3">
            <div className="w-full mb-6">
              <Image
                src={post.feature_image}
                alt={post.name}
                width={1200}
                height={1600}
                className="w-full h-auto"
              />
            </div>

            {post.additional_images && post.additional_images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {post.additional_images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-full aspect-square"
                  >
                    <Image
                      src={image}
                      alt={`${post.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8 lg:pt-2">
            <div>
              <p className="text-xs font-light tracking-widest text-gray-500 uppercase mb-3">
                {post.brand}
              </p>
              <h1 className="text-xl font-light text-gray-900 mb-6 leading-relaxed">
                {post.name}
              </h1>
              {post.price && (
                <p className="text-sm font-light text-gray-900 mb-8">
                  ${post.price}
                </p>
              )}
              <Link href={post.url} target="_blank" rel="noopener noreferrer">
                <Button className="w-full" size="default">
                  View Product
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <p className="text-sm font-light text-gray-600 leading-relaxed">
                {post.description}
              </p>
            </div>

            {post.long_commentary && (
              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-xs font-light tracking-widest text-gray-500 uppercase mb-4">
                  Commentary
                </h2>
                <p className="text-sm font-light text-gray-600 leading-relaxed italic">
                  {post.long_commentary}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}