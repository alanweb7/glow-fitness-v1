-- Drop and recreate storage buckets properly
DELETE FROM storage.objects WHERE bucket_id IN ('product-images', 'banner-images', 'blog-images', 'general');
DELETE FROM storage.buckets WHERE id IN ('product-images', 'banner-images', 'blog-images', 'general');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
('banner-images', 'banner-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('blog-images', 'blog-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('general', 'general', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
