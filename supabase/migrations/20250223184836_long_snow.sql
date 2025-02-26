/*
  # Add social media and contact information

  1. Updates
    - Add social media URLs to site_config
    - Add contact information to site_config
    - Add products table
    - Add gallery table

  2. Changes
    - Adds facebook_url, instagram_url, whatsapp_number to site_config
    - Adds contact_phone, contact_email, contact_address to site_config
    - Creates products table with necessary fields
    - Creates gallery table for portfolio images
*/

-- Add new columns to site_config
ALTER TABLE site_config 
ADD COLUMN IF NOT EXISTS facebook_url text DEFAULT '',
ADD COLUMN IF NOT EXISTS instagram_url text DEFAULT '',
ADD COLUMN IF NOT EXISTS whatsapp_number text DEFAULT '',
ADD COLUMN IF NOT EXISTS contact_phone text DEFAULT '',
ADD COLUMN IF NOT EXISTS contact_email text DEFAULT '',
ADD COLUMN IF NOT EXISTS contact_address text DEFAULT '',
ADD COLUMN IF NOT EXISTS whatsapp_message text DEFAULT 'Merhaba, bilgi almak istiyorum.';

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Policies for products
CREATE POLICY "Allow public read access to products" 
  ON products FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Allow admin full access to products" 
  ON products FOR ALL 
  TO authenticated 
  USING (auth.role() = 'admin');

-- Policies for gallery
CREATE POLICY "Allow public read access to gallery" 
  ON gallery FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Allow admin full access to gallery" 
  ON gallery FOR ALL 
  TO authenticated 
  USING (auth.role() = 'admin');

-- Add triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at
  BEFORE UPDATE ON gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();