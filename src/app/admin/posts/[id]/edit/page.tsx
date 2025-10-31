'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Post, PostUpdate } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/ImageUpload';
import Link from 'next/link';

export default function EditPost() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<Partial<PostUpdate>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadingPost, setLoadingPost] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    } else if (user && postId) {
      fetchPost();
    }
  }, [user, loading, router, postId]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        throw error;
      }

      setPost(data);
      setFormData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoadingPost(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { id, created_at, ...updateData } = formData;

      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId);

      if (error) {
        throw error;
      }

      router.push('/admin/posts');
    } catch (err: any) {
      setError(err.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof PostUpdate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading || loadingPost || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Post not found</h2>
          <Link href="/admin/posts">
            <Button>← Back to Posts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Post
              </h1>
              <p className="text-gray-600 mt-1">
                Update {post.name}
              </p>
            </div>
            <Link href="/admin/posts">
              <Button variant="outline">
                ← Back to Posts
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="e.g., Ultralight Backpack 35L"
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <Input
                  id="brand"
                  value={formData.brand || ''}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  required
                  placeholder="e.g., Peak Design"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feature Image *
              </label>
              <ImageUpload
                value={formData.feature_image || ''}
                onChange={(url) => handleInputChange('feature_image', url)}
                onRemove={() => handleInputChange('feature_image', '')}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  Product URL *
                </label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url || ''}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  required
                  placeholder="https://example.com/product"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="199.99"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                rows={4}
                placeholder="Detailed product description..."
              />
            </div>

            <div>
              <label htmlFor="short_commentary" className="block text-sm font-medium text-gray-700 mb-1">
                Short Commentary
              </label>
              <Textarea
                id="short_commentary"
                value={formData.short_commentary || ''}
                onChange={(e) => handleInputChange('short_commentary', e.target.value)}
                rows={2}
                placeholder="Brief thoughts for the chat feed..."
              />
              <p className="text-xs text-gray-500 mt-1">
                This will appear as your comment in the chat feed
              </p>
            </div>

            <div>
              <label htmlFor="long_commentary" className="block text-sm font-medium text-gray-700 mb-1">
                Long Commentary
              </label>
              <Textarea
                id="long_commentary"
                value={formData.long_commentary || ''}
                onChange={(e) => handleInputChange('long_commentary', e.target.value)}
                rows={6}
                placeholder="Detailed review and thoughts..."
              />
              <p className="text-xs text-gray-500 mt-1">
                This will appear on the detail page
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={formData.published || false}
                onCheckedChange={(checked) => handleInputChange('published', checked)}
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">
                Published
              </label>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Link href="/admin/posts">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? 'Updating...' : 'Update Post'}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}