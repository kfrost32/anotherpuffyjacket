'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Post } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
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
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to feed
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to feed
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Another Puffy Jacket
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Card className="p-4 sm:p-6 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <div>
              <div className="relative h-96 w-full rounded-lg overflow-hidden mb-4">
                <Image
                  src={post.feature_image}
                  alt={post.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {post.additional_images && post.additional_images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {post.additional_images.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-24 rounded-lg overflow-hidden"
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

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.brand}</Badge>
                  {post.price && (
                    <span className="text-2xl font-bold text-green-600">
                      ${post.price}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {post.name}
                </h1>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {post.description}
                </p>
              </div>

              {post.long_commentary && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    My Take
                  </h2>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {post.long_commentary}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Link href={post.url} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Product
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}