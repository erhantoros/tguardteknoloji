/*
  # Add featured flag to products

  1. Changes
    - Add `is_featured` column to products table
    - Add `featured_order` column for sorting featured products
*/

-- Add is_featured column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE products
    ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;

-- Add featured_order column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'featured_order'
  ) THEN
    ALTER TABLE products
    ADD COLUMN featured_order integer DEFAULT 0;
  END IF;
END $$;