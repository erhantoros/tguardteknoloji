/*
  # Site Settings Table

  1. Changes
    - Drop existing site_config table
    - Create new site_settings table with required fields
    - Add RLS policies
    - Insert default settings

  2. Fields
    - company_name: Şirket adı
    - contact_phone: İletişim telefonu
    - contact_email: İletişim e-postası
    - contact_address: İletişim adresi
    - social_facebook: Facebook linki
    - social_instagram: Instagram linki
    - social_whatsapp: WhatsApp numarası
    - whatsapp_message: WhatsApp varsayılan mesaj
*/

-- Drop existing table
DROP TABLE IF EXISTS site_config;

-- Create new table
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'TGuard Teknoloji',
  contact_phone text,
  contact_email text,
  contact_address text,
  social_facebook text,
  social_instagram text,
  social_whatsapp text,
  whatsapp_message text DEFAULT 'Merhaba, bilgi almak istiyorum.',
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

-- Insert default settings
INSERT INTO site_settings (
  company_name,
  contact_phone,
  contact_email,
  contact_address,
  social_facebook,
  social_instagram,
  social_whatsapp,
  whatsapp_message
) VALUES (
  'TGuard Teknoloji',
  '',
  '',
  '',
  '',
  '',
  '',
  'Merhaba, bilgi almak istiyorum.'
) ON CONFLICT DO NOTHING;