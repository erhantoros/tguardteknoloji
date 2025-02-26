/*
  # Create Storage Bucket

  1. New Storage Bucket
    - Create a public bucket for file uploads
    - Enable RLS policies for secure access
*/

-- Create public bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public');

-- Create policy to allow public access to files
CREATE POLICY "Allow public access to files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'public');

-- Create policy to allow authenticated users to update and delete their own files
CREATE POLICY "Allow authenticated users to update and delete their files"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'public' AND auth.uid() = owner);