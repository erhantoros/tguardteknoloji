-- Add cart related tables
CREATE TABLE IF NOT EXISTS carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid REFERENCES carts(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow users to manage their own cart"
  ON carts FOR ALL
  TO public
  USING (user_email IS NOT NULL)
  WITH CHECK (user_email IS NOT NULL);

CREATE POLICY "Allow users to manage their own cart items"
  ON cart_items FOR ALL
  TO public
  USING (cart_id IN (SELECT id FROM carts WHERE user_email IS NOT NULL))
  WITH CHECK (cart_id IN (SELECT id FROM carts WHERE user_email IS NOT NULL));

-- Create trigger for updated_at
CREATE TRIGGER update_carts_updated_at
  BEFORE UPDATE ON carts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add direct payment column to orders if it doesn't exist
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS is_direct_payment boolean DEFAULT false;