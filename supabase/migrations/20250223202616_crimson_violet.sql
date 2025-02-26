/*
  # Fix RLS Policies

  1. Changes
    - Update RLS policies for products, gallery and services tables
    - Add policies for authenticated users to manage content
  
  2. Security
    - Enable RLS on all tables
    - Add proper policies for CRUD operations
*/

-- Products Table Policies
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow admin full access to products" ON products;

CREATE POLICY "Allow public read access to products"
ON products FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to manage products"
ON products FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Gallery Table Policies
DROP POLICY IF EXISTS "Allow public read access to gallery" ON gallery;
DROP POLICY IF EXISTS "Allow admin full access to gallery" ON gallery;

CREATE POLICY "Allow public read access to gallery"
ON gallery FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to manage gallery"
ON gallery FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Services Table Policies
DROP POLICY IF EXISTS "Allow public read access to services" ON services;
DROP POLICY IF EXISTS "Allow admin full access to services" ON services;

CREATE POLICY "Allow public read access to services"
ON services FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to manage services"
ON services FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Add predefined categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  type text NOT NULL, -- 'product', 'gallery', or 'service'
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Allow public read access to categories"
ON categories FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to manage categories"
ON categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert default categories
INSERT INTO categories (name, type) VALUES
-- Product Categories
('Güvenlik Kameraları', 'product'),
('Ağ Cihazları', 'product'),
('Bilgisayar Parçaları', 'product'),
('UPS Sistemleri', 'product'),
('Yazılım Ürünleri', 'product'),
-- Gallery Categories
('Tamamlanan Projeler', 'gallery'),
('Kamera Sistemleri', 'gallery'),
('Ağ Kurulumları', 'gallery'),
('Sunucu Odaları', 'gallery'),
('Referanslar', 'gallery'),
-- Service Categories
('Bilgisayar Servisi', 'service'),
('Güvenlik Sistemleri', 'service'),
('Ağ Çözümleri', 'service'),
('Yazılım Hizmetleri', 'service'),
('Teknik Destek', 'service')
ON CONFLICT (name) DO NOTHING;