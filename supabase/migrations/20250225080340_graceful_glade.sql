-- Add price column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'price'
  ) THEN
    ALTER TABLE products
    ADD COLUMN price decimal(10,2) DEFAULT NULL;
  END IF;
END $$;