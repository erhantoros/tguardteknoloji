/*
  # Fix Site Settings Table

  1. Changes
    - Drop existing tables
    - Create new site_settings table with proper structure
    - Add trigger for updated_at
    - Insert default settings

  2. Security
    - Enable RLS
    - Add policies for public read and authenticated write
*/

-- Drop existing tables if exist
DROP TABLE IF EXISTS site_config CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- Create new site_settings table
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'TGuard Teknoloji',
  contact_phone text DEFAULT '',
  contact_email text DEFAULT '',
  contact_address text DEFAULT '',
  social_facebook text DEFAULT '',
  social_instagram text DEFAULT '',
  social_whatsapp text DEFAULT '',
  whatsapp_message text DEFAULT 'Merhaba, bilgi almak istiyorum.',
  logo_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
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
  contact_phone,
  contact_email,
  contact_address,
  social_facebook,
  social_instagram,
  social_whatsapp,
  whatsapp_message,
  logo_url
) VALUES (
  'TGuard Teknoloji',
  '',
  '',
  '',
  '',
  '',
  '',
  'Merhaba, bilgi almak istiyorum.',
  ''
);