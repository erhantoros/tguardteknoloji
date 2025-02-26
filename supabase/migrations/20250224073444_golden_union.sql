/*
  # Add notes column to contact_forms table

  1. Changes
    - Add notes column to contact_forms table to store notes for each contact request
    - Set default value as empty array
    - Add migration safety checks

  2. Security
    - No changes to RLS policies required
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