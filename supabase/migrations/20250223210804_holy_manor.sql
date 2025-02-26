/*
  # Fix site settings table structure
  
  This migration:
  1. Drops the existing site_settings table
  2. Creates a new one with the correct structure
  3. Adds all necessary columns
  4. Sets up RLS policies
*/

-- Drop existing table if exists
DROP TABLE IF EXISTS site_settings CASCADE;

-- Create new site_settings table with correct structure
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text DEFAULT '',
  company_name text NOT NULL DEFAULT 'TGuard Teknoloji',
  primary_color text DEFAULT '#2563eb',
  contact_phone text DEFAULT '',
  contact_email text DEFAULT '',
  contact_address text DEFAULT '',
  social_facebook text DEFAULT '',
  social_instagram text DEFAULT '',
  social_whatsapp text DEFAULT '',
  whatsapp_message text DEFAULT 'Merhaba, bilgi almak istiyorum.',
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