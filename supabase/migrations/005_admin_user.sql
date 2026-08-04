-- Update admin user metadata
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin", "full_name": "Alan Silva"}'::jsonb
WHERE email = 'alanweb7@gmail.com';

-- Create user_profiles table for admin role management
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'manager', 'customer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin all user_profiles" ON user_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert admin profile
INSERT INTO user_profiles (id, full_name, role)
SELECT id, 'Alan Silva', 'admin'
FROM auth.users
WHERE email = 'alanweb7@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = 'Alan Silva';
