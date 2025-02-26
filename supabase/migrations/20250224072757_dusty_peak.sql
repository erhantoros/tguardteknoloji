/*
  # Contact Forms tablosuna notes sütunu ekleme

  1. Değişiklikler
    - contact_forms tablosuna notes sütunu ekleme (text[] tipinde)
*/

-- Add notes column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'contact_forms' 
    AND column_name = 'notes'
  ) THEN
    ALTER TABLE contact_forms
    ADD COLUMN notes text[] DEFAULT '{}';
  END IF;
END $$;