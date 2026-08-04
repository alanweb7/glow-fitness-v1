import { supabase } from './supabase';

export type Bucket = 'product-images' | 'banner-images' | 'blog-images' | 'general';

interface UploadResult {
  url: string;
  path: string;
}

export async function uploadImage(
  file: File,
  bucket: Bucket,
  fileName?: string
): Promise<UploadResult> {
  const ext = file.name.split('.').pop();
  const path = fileName || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return {
    url: urlData.publicUrl,
    path,
  };
}

export async function deleteImage(bucket: Bucket, path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

export function getPublicUrl(bucket: Bucket, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

export function getImageUrlFromSupabase(url: string): string {
  if (url && !url.startsWith('http')) {
    return getPublicUrl('general', url);
  }
  return url;
}
