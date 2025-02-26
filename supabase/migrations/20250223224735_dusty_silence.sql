/*
  # Add image_url column to services table

  1. Changes
    - Add image_url column to services table
*/

-- Add image_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'services' 
    AND column_name = 'image_url'
  ) THEN
    ALTER TABLE services
    ADD COLUMN image_url text DEFAULT '';
  END IF;
END $$;