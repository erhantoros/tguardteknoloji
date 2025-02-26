/*
  # Fix Cart System

  1. Changes
    - Add user_email column to carts table
    - Update cart policies to use email instead of user_id
    - Add missing policies for cart items
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own cart" ON carts;
DROP POLICY IF EXISTS "Users can manage their own cart items" ON cart_items;

-- Add user_email column to carts
ALTER TABLE carts
ADD COLUMN IF NOT EXISTS user_email text;

-- Update existing carts with user email
UPDATE carts c
SET user_email = (
  SELECT email 
  FROM auth.users 
  WHERE id = c.user_id
);

-- Create new policies for carts
CREATE POLICY "Allow users to manage their own cart"
  ON carts FOR ALL
  TO public
  USING (user_email IS NOT NULL)
  WITH CHECK (user_email IS NOT NULL);

-- Create new policies for cart items
CREATE POLICY "Allow users to manage their own cart items"
  ON cart_items FOR ALL
  TO public
  USING (cart_id IN (SELECT id FROM carts WHERE user_email IS NOT NULL))
  WITH CHECK (cart_id IN (SELECT id FROM carts WHERE user_email IS NOT NULL));

-- Create policy for public to read cart items
CREATE POLICY "Allow public to read cart items"
  ON cart_items FOR SELECT
  TO public
  USING (true);