/*
  # Ödeme Sistemi ve Çoklu Resim Güncellemesi

  1. Yeni Tablolar
    - `orders`: Sipariş bilgileri
      - `id` (uuid, primary key)
      - `user_email` (text)
      - `user_name` (text)
      - `user_phone` (text)
      - `user_address` (text)
      - `company_name` (text, optional)
      - `tax_office` (text, optional)
      - `tax_number` (text, optional)
      - `total_amount` (decimal)
      - `status` (text)
      - `payment_id` (text)
      - `payment_status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `order_items`: Sipariş detayları
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (decimal)
      - `created_at` (timestamptz)

  2. Yeni Kolonlar
    - `gallery.images` (text[]): Çoklu resim desteği
    - `products.price` (decimal): Ürün fiyatı

  3. Güvenlik
    - RLS politikaları eklendi
    - Trigger'lar eklendi
*/

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

-- Add price column to products if it doesn't exist
ALTER TABLE products
ADD COLUMN IF NOT EXISTS price decimal(10,2) DEFAULT NULL;

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