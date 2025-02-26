-- Add payment related tables
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  user_name text NOT NULL,
  user_phone text NOT NULL,
  user_address text NOT NULL,
  company_name text,
  tax_office text,
  tax_number text,
  total_amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_id text,
  payment_status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add images array to gallery table if it doesn't exist
ALTER TABLE gallery
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public to create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow users to view their own orders"
  ON orders FOR SELECT
  TO public
  USING (user_email IS NOT NULL);

CREATE POLICY "Allow authenticated users to manage orders"
  ON orders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage order items"
  ON order_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();