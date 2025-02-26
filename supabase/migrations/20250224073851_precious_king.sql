/*
  # Fix Contact Form Policies

  1. Changes
    - Drop existing policies
    - Create new policies for contact_forms table
    - Allow public to create contact forms
    - Allow public to read contact forms
    - Allow authenticated users to manage contact forms
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public to create contact forms" ON contact_forms;
DROP POLICY IF EXISTS "Allow admin full access to contact forms" ON contact_forms;

-- Create new policies
CREATE POLICY "Allow public to create contact forms"
ON contact_forms FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public to read contact forms"
ON contact_forms FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to manage contact forms"
ON contact_forms FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);