import { supabase } from './supabase';

export const uploadImage = async (file: File, bucket: string = 'images'): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl;
};

export const deleteImage = async (url: string, bucket: string = 'images'): Promise<void> => {
  // Extract filename from URL
  const urlParts = url.split('/');
  const fileName = urlParts[urlParts.length - 1];
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName]);

  if (error) {
    throw error;
  }
};