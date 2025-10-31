-- Note: Storage bucket and policies must be created through Supabase Dashboard
-- Go to Dashboard → Storage → Create bucket named 'images' with public access
-- Then add these policies through the Storage Policies interface:

/*
CREATE POLICY "Allow public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
*/