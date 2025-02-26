/*
  # Add logo_url field to site_settings

  This migration adds the logo_url field to the site_settings table
  and ensures it has a default value.
*/

-- Check if the column exists before adding it
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'site_settings' 
    AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE site_settings
    ADD COLUMN logo_url text DEFAULT '';
  END IF;
END $$;