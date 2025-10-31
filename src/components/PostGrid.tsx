'use client';

import { useEffect, useState } from 'react';
import { PostCard } from './PostCard';
import { Post } from '@/types/database';
import { supabase } from '@/lib/supabase';

export function PostGrid() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No posts yet
        </h3>
        <p className="text-gray-600">
          Check back soon for the latest outdoor gear finds!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-necto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 items-end">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} type="product" index={index} />
        ))}
      </div>
    </div>
  );
}