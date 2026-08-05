-- =============================================
-- ROLES & PERMISSIONS SYSTEM
-- =============================================

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(module, action)
);

-- 3. ROLE_PERMISSIONS TABLE (junction)
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 4. ADD role_id TO user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role_id TEXT REFERENCES roles(id) ON DELETE SET NULL;

-- =============================================
-- SEED DEFAULT ROLES
-- =============================================
INSERT INTO roles (id, name, description, is_system) VALUES
  ('admin', 'Administrador', 'Acesso total ao sistema', true),
  ('manager', 'Gerente', 'Gerencia pedidos, produtos e conteúdo', true),
  ('editor', 'Editor', 'Edita conteúdo do blog e banners', false),
  ('customer', 'Cliente', 'Acesso padrão à loja', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SEED PERMISSIONS
-- =============================================
INSERT INTO permissions (id, module, action, description) VALUES
  -- Products
  ('products.read',    'products',    'read',    'Visualizar produtos'),
  ('products.write',   'products',    'write',   'Criar e editar produtos'),
  ('products.delete',  'products',    'delete',  'Excluir produtos'),
  -- Categories
  ('categories.read',  'categories',  'read',    'Visualizar categorias'),
  ('categories.write', 'categories',  'write',   'Criar e editar categorias'),
  -- Orders
  ('orders.read',      'orders',      'read',    'Visualizar pedidos'),
  ('orders.write',     'orders',      'write',   'Gerenciar pedidos e status'),
  -- Customers
  ('customers.read',   'customers',   'read',    'Visualizar clientes'),
  ('customers.write',  'customers',   'write',   'Editar clientes'),
  -- Coupons
  ('coupons.read',     'coupons',     'read',    'Visualizar cupons'),
  ('coupons.write',    'coupons',     'write',   'Criar e editar cupons'),
  -- Banners
  ('banners.read',     'banners',     'read',    'Visualizar banners'),
  ('banners.write',    'banners',     'write',   'Criar e editar banners'),
  -- Blog
  ('blog.read',        'blog',        'read',    'Visualizar blog'),
  ('blog.write',       'blog',        'write',   'Criar e editar posts'),
  -- Users
  ('users.read',       'users',       'read',    'Visualizar usuários'),
  ('users.write',      'users',       'write',   'Criar e editar usuários'),
  ('users.delete',     'users',       'delete',  'Excluir usuários'),
  -- Roles
  ('roles.read',       'roles',       'read',    'Visualizar perfis de acesso'),
  ('roles.write',      'roles',       'write',   'Criar e editar perfis de acesso'),
  -- Settings
  ('settings.read',    'settings',    'read',    'Visualizar configurações'),
  ('settings.write',   'settings',    'write',   'Editar configurações')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SEED ROLE_PERMISSIONS
-- =============================================

-- Admin: all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'admin', id FROM permissions
ON CONFLICT DO NOTHING;

-- Manager: everything except users.delete and roles.write
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'manager', id FROM permissions
WHERE id NOT IN ('users.delete', 'roles.write', 'settings.write')
ON CONFLICT DO NOTHING;

-- Editor: blog, banners, products.read, categories.read
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'editor', id FROM permissions
WHERE id IN ('blog.read', 'blog.write', 'banners.read', 'banners.write', 'products.read', 'categories.read')
ON CONFLICT DO NOTHING;

-- Customer: only products.read, categories.read
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'customer', id FROM permissions
WHERE id IN ('products.read', 'categories.read')
ON CONFLICT DO NOTHING;

-- =============================================
-- UPDATE EXISTING USER_PROFILES TO LINK ROLES
-- =============================================
UPDATE user_profiles SET role_id = role WHERE role_id IS NULL;

-- =============================================
-- RLS POLICIES
-- =============================================
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins full access on roles" ON roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins full access on permissions" ON permissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins full access on role_permissions" ON role_permissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Managers can read roles/permissions
CREATE POLICY "Managers read roles" ON roles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Managers read permissions" ON permissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

CREATE POLICY "Managers read role_permissions" ON role_permissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Anon can read roles (for display purposes)
CREATE POLICY "Anon read roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Anon read permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "Anon read role_permissions" ON role_permissions FOR SELECT USING (true);

-- =============================================
-- HELPER: GET USER PERMISSIONS FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION get_user_permissions(user_uuid UUID)
RETURNS TABLE(permission_id TEXT)
LANGUAGE sql STABLE
AS $$
  SELECT rp.permission_id
  FROM user_profiles up
  JOIN role_permissions rp ON rp.role_id = up.role_id
  WHERE up.id = user_uuid;
$$;

-- =============================================
-- HELPER: CHECK IF USER HAS PERMISSION
-- =============================================
CREATE OR REPLACE FUNCTION user_has_permission(user_uuid UUID, perm_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_profiles up
    JOIN role_permissions rp ON rp.role_id = up.role_id
    WHERE up.id = user_uuid AND rp.permission_id = perm_id
  );
$$;
