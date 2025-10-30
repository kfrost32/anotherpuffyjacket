-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  feature_image TEXT NOT NULL,
  additional_images TEXT[],
  url TEXT NOT NULL,
  price DECIMAL(10,2),
  description TEXT NOT NULL,
  short_commentary TEXT,
  long_commentary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published BOOLEAN DEFAULT false
);

-- Create an index on published posts for faster queries
CREATE INDEX idx_posts_published ON posts(published, created_at DESC);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - we'll restrict later with auth)
CREATE POLICY "Allow all operations on posts" ON posts FOR ALL USING (true);

-- Create storage bucket for images (run this in Supabase Dashboard > Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Storage policies for images bucket (run in Supabase Dashboard > Storage > images bucket > Policies)
-- CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
-- CREATE POLICY "Allow authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated delete" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Sample data for testing
INSERT INTO posts (name, brand, feature_image, url, price, description, short_commentary, long_commentary, published) VALUES
('Ultralight Backpack 35L', 'Peak Design', 'https://example.com/backpack.jpg', 'https://peakdesign.com/backpack', 199.99, 'A revolutionary ultralight backpack perfect for multi-day hikes.', 'This thing is a game changer for ultralight backpacking.', 'After testing this on a 5-day hike in the Sierra Nevada, I can confidently say this backpack has redefined what I expect from outdoor gear. The thoughtful design details and premium materials make every gram count.', true),
('Winter Sleeping Bag -20°F', 'Western Mountaineering', 'https://example.com/sleeping-bag.jpg', 'https://westernmountaineering.com/sleeping-bag', 549.99, 'Premium down sleeping bag rated for extreme cold conditions.', 'Worth every penny for serious winter camping.', 'Western Mountaineering continues to set the standard for premium sleeping bags. The fill power and construction quality justify the price point for anyone serious about winter adventures.', true);