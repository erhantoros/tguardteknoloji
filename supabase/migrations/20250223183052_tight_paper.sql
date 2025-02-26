/*
  # Create site_config table

  1. New Tables
    - `site_config`
      - `id` (uuid, primary key)
      - `logo_url` (text)
      - `company_name` (text)
      - `primary_color` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `site_config` table
    - Add policy for public read access
    - Add policy for admin write access
*/

CREATE TABLE IF NOT EXISTS site_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text NOT NULL,
  company_name text NOT NULL,
  primary_color text NOT NULL DEFAULT '#2563eb',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to site_config"
  ON site_config FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin full access to site_config"
  ON site_config FOR ALL
  TO authenticated
  USING (auth.role() = 'admin');

-- Create trigger for updated_at
CREATE TRIGGER update_site_config_updated_at
  BEFORE UPDATE ON site_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default config
INSERT INTO site_config (logo_url, company_name)
VALUES ('https://example.com/logo.png', 'TGuard Teknoloji')
ON CONFLICT DO NOTHING;