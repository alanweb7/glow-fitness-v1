-- Fix RLS policies for Supabase anon key access

-- Drop all existing policies
DO $$ DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'categories','products','product_variations','coupons','banners',
    'orders','order_items','reviews','blog_posts','home_sections',
    'theme_config','store_settings'
  ]) LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public read %s" ON %s', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated all %s" ON %s', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Service role all %s" ON %s', t, t);
  END LOOP;
END $$;

-- Recreate policies: public can read, anon can read/write, service_role full access
DO $$ DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'categories','products','product_variations','coupons','banners',
    'orders','order_items','reviews','blog_posts','home_sections',
    'theme_config','store_settings'
  ]) LOOP
    -- Anyone can read
    EXECUTE format('CREATE POLICY "public_read_%s" ON %s FOR SELECT USING (true)', t, t);
    -- Anon can do everything (for storefront without auth)
    EXECUTE format('CREATE POLICY "anon_all_%s" ON %s FOR ALL USING (true) WITH CHECK (true)', t, t);
  END LOOP;
END $$;
