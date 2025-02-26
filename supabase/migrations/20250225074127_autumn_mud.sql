/*
  # Add PayTR Integration Columns

  1. New Columns
    - paytr_merchant_id (text)
    - paytr_merchant_key (text)
    - paytr_merchant_salt (text)
    - payment_enabled (boolean)
    - test_mode (boolean)
    - max_installment (integer)

  2. Changes
    - Add default values for new columns
*/

-- Add PayTR columns if they don't exist
DO $$ 
BEGIN
  -- Add paytr_merchant_id
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'site_settings' 
    AND column_name = 'paytr_merchant_id'
  ) THEN
    ALTER TABLE site_settings
    ADD COLUMN paytr_merchant_id text DEFAULT '';
  END IF;

  -- Add paytr_merchant_key
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'site_settings' 
    AND column_name = 'paytr_merchant_key'
  ) THEN
    ALTER TABLE site_settings
    ADD COLUMN paytr_merchant_key text DEFAULT '';
  END IF;

  -- Add paytr_merchant_salt
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'site_settings' 
    AND column_name = 'paytr_merchant_salt'
  ) THEN
    ALTER TABLE site_settings
    ADD COLUMN paytr_merchant_salt text DEFAULT '';
  END IF;

  -- Add payment_enabled
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'site_settings' 
    AND column_name = 'payment_enabled'
  ) THEN
    ALTER TABLE site_settings
    ADD COLUMN payment_enabled boolean DEFAULT false;
  END IF;

  -- Add test_mode
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'site_settings' 
    AND column_name = 'test_mode'
  ) THEN
    ALTER TABLE site_settings
    ADD COLUMN test_mode boolean DEFAULT true;
  END IF;

  -- Add max_installment
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'site_settings' 
    AND column_name = 'max_installment'
  ) THEN
    ALTER TABLE site_settings
    ADD COLUMN max_installment integer DEFAULT 12;
  END IF;
END $$;