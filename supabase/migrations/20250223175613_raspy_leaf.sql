/*
  # Initial Schema Setup for TGuard Technology

  1. New Tables
    - services
      - Stores service information including title, description, price
    - contact_forms
      - Stores contact form submissions and inquiries
    - users
      - Stores admin user information
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin access
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  price decimal,
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_forms table
CREATE TABLE IF NOT EXISTS contact_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  service_type text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;

-- Policies for services table
CREATE POLICY "Allow public read access to services" 
  ON services FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Allow admin full access to services" 
  ON services FOR ALL 
  TO authenticated 
  USING (auth.role() = 'admin');

-- Policies for contact_forms table
CREATE POLICY "Allow public to create contact forms" 
  ON contact_forms FOR INSERT 
  TO public 
  WITH CHECK (true);

CREATE POLICY "Allow admin full access to contact forms" 
  ON contact_forms FOR ALL 
  TO authenticated 
  USING (auth.role() = 'admin');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for services table
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();