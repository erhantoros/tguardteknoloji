/*
  # Fix site settings table

  This migration fixes issues with the site settings functionality by:
  1. Dropping and recreating the site_settings table with proper structure
  2. Adding proper RLS policies
  3. Setting up default values
  4. Adding proper triggers for updated_at
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS site_config CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- Create new site_settings table
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text DEFAULT '',
  company_name text NOT NULL DEFAULT 'TGuard Teknoloji',
  primary_color text DEFAULT '#2563eb',
  facebook_url text DEFAULT '',
  instagram_url text DEFAULT '',
  whatsapp_number text DEFAULT '',
  contact_phone text DEFAULT '',
  contact_email text DEFAULT '',
  contact_address text DEFAULT '',
  whatsapp_message text DEFAULT 'Merhaba, bilgi almak istiyorum.',
  google_maps_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to site_settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage site_settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO site_settings (
  company_name,
  primary_color,
  whatsapp_message
) VALUES (
  'TGuard Teknoloji',
  '#2563eb',
  'Merhaba, bilgi almak istiyorum.'
) ON CONFLICT DO NOTHING;