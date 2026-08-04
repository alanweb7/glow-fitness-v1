-- ============================================
-- GLOW FITNESS - Database Schema
-- ============================================

-- CATEGORIES
CREATE TABLE categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  icon TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  parent_id TEXT REFERENCES categories(id),
  active BOOLEAN NOT NULL DEFAULT true,
  is_highlight_circle BOOLEAN DEFAULT false,
  highlight_color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(active);
CREATE INDEX idx_categories_order ON categories("order");

-- PRODUCTS
CREATE TABLE products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  category_id TEXT NOT NULL REFERENCES categories(id),
  category_name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'Glow Fitness',
  collection TEXT,
  price NUMERIC(10,2) NOT NULL,
  promotional_price NUMERIC(10,2),
  sku TEXT NOT NULL,
  barcode TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  is_on_sale BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  weight_kg NUMERIC(5,2) DEFAULT 0,
  dimensions_cm JSONB DEFAULT '{"height": 0, "width": 0, "length": 0}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_is_on_sale ON products(is_on_sale);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- PRODUCT VARIATIONS
CREATE TABLE product_variations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('PP', 'P', 'M', 'G', 'GG')),
  sku TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  promotional_price NUMERIC(10,2),
  stock INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_variations_product_id ON product_variations(product_id);
CREATE INDEX idx_variations_sku ON product_variations(sku);

-- COUPONS
CREATE TABLE coupons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fixed', 'percentage', 'free_shipping')),
  value NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_order_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_usage INTEGER NOT NULL DEFAULT 0,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at DATE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(active);

-- BANNERS
CREATE TABLE banners (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  subtitle TEXT,
  desktop_image TEXT NOT NULL,
  mobile_image TEXT NOT NULL,
  cta_text TEXT,
  cta_url TEXT,
  position TEXT NOT NULL DEFAULT 'hero' CHECK (position IN ('hero', 'middle', 'popup')),
  active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_banners_position ON banners(position);
CREATE INDEX idx_banners_active ON banners(active);

-- ORDERS
CREATE TABLE orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_number TEXT UNIQUE NOT NULL,
  customer JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'credit_card', 'boleto')),
  payment_details JSONB,
  status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Pago', 'Em Separação', 'Enviado', 'Entregue', 'Cancelado', 'Reembolsado')),
  status_history JSONB NOT NULL DEFAULT '[]',
  tracking_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ORDER ITEMS
CREATE TABLE order_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_image TEXT,
  price NUMERIC(10,2) NOT NULL,
  color_name TEXT,
  size TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  max_stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- REVIEWS
CREATE TABLE reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  author TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);

-- BLOG POSTS
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  author TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- HOME SECTIONS
CREATE TABLE home_sections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hero', 'announcement', 'categories', 'highlights', 'about', 'banners', 'testimonials', 'instagram', 'blog', 'newsletter', 'footer')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_home_sections_order ON home_sections("order");

-- THEME CONFIG (single row)
CREATE TABLE theme_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  primary_color TEXT NOT NULL DEFAULT '#C18282',
  secondary_color TEXT NOT NULL DEFAULT '#1A1A1A',
  accent_color TEXT NOT NULL DEFAULT '#EAD3D0',
  background_color TEXT NOT NULL DEFAULT '#FAF7F6',
  text_color TEXT NOT NULL DEFAULT '#1A1A1A',
  card_background_color TEXT NOT NULL DEFAULT '#FFFFFF',
  button_radius TEXT NOT NULL DEFAULT 'sm' CHECK (button_radius IN ('none', 'sm', 'md', 'lg', 'full')),
  font_family TEXT NOT NULL DEFAULT 'sans' CHECK (font_family IN ('sans', 'serif', 'display')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- STORE SETTINGS (single row)
CREATE TABLE store_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  store_name TEXT NOT NULL DEFAULT 'Glow Fitness',
  slogan TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  youtube TEXT,
  address TEXT,
  business_hours TEXT,
  free_shipping_threshold NUMERIC(10,2) NOT NULL DEFAULT 199,
  mercado_pago_public_key TEXT,
  mercado_pago_access_token TEXT,
  seo_title TEXT,
  seo_description TEXT,
  google_analytics_id TEXT,
  meta_pixel_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for storefront tables
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_variations" ON product_variations FOR SELECT USING (true);
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Public read home_sections" ON home_sections FOR SELECT USING (true);
CREATE POLICY "Public read theme_config" ON theme_config FOR SELECT USING (true);
CREATE POLICY "Public read store_settings" ON store_settings FOR SELECT USING (true);

-- Full access for service_role (admin operations)
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all products" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all product_variations" ON product_variations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all coupons" ON coupons FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all banners" ON banners FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all orders" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all order_items" ON order_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all reviews" ON reviews FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all home_sections" ON home_sections FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all theme_config" ON theme_config FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin all store_settings" ON store_settings FOR ALL USING (auth.role() = 'service_role');
