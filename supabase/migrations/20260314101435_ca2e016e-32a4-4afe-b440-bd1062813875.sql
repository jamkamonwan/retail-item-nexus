
-- Add attachments column to terms_versions for file URLs
ALTER TABLE public.terms_versions ADD COLUMN attachments jsonb DEFAULT '[]'::jsonb;

-- Create storage bucket for terms attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('terms-attachments', 'terms-attachments', true);

-- Allow authenticated users to upload to terms-attachments bucket
CREATE POLICY "Authenticated can upload terms attachments"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'terms-attachments');

-- Allow public read access
CREATE POLICY "Public read terms attachments"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'terms-attachments');

CREATE POLICY "Authenticated read terms attachments"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'terms-attachments');

-- Allow authenticated delete
CREATE POLICY "Authenticated can delete terms attachments"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'terms-attachments');
