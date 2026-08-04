-- ============================================
-- GLOW FITNESS - Storage Buckets & Policies
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
('banner-images', 'banner-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('blog-images', 'blog-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('general', 'general', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Storage policies: public can read, anyone can upload (for simplicity)
-- In production, you'd restrict uploads to authenticated users

-- product-images policies
CREATE POLICY "Public read product-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Anon insert product-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anon update product-images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Anon delete product-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');

-- banner-images policies
CREATE POLICY "Public read banner-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'banner-images');

CREATE POLICY "Anon insert banner-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'banner-images');

CREATE POLICY "Anon update banner-images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'banner-images');

CREATE POLICY "Anon delete banner-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'banner-images');

-- blog-images policies
CREATE POLICY "Public read blog-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Anon insert blog-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anon update blog-images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'blog-images');

CREATE POLICY "Anon delete blog-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-images');

-- general policies
CREATE POLICY "Public read general" ON storage.objects
  FOR SELECT USING (bucket_id = 'general');

CREATE POLICY "Anon insert general" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'general');

CREATE POLICY "Anon update general" ON storage.objects
  FOR UPDATE USING (bucket_id = 'general');

CREATE POLICY "Anon delete general" ON storage.objects
  FOR DELETE USING (bucket_id = 'general');
