-- Migration: Add media fields and seller_portfolio_media table for provider media uploads
-- Run these statements in your Supabase SQL editor or via psql connected to the project DB.

-- 1) Add columns to seller_profiles for profile and cover paths
ALTER TABLE public.seller_profiles
  ADD COLUMN IF NOT EXISTS profile_photo_path text;

ALTER TABLE public.seller_profiles
  ADD COLUMN IF NOT EXISTS cover_photo_path text;

-- 2) Create seller_portfolio_media table if missing
CREATE TABLE IF NOT EXISTS public.seller_portfolio_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.seller_profiles(user_id) ON DELETE CASCADE,
  path text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now()
);

-- 3) RLS policies (recommended) for seller_portfolio_media and seller_profiles
-- Enable RLS if not already enabled and create row-level policies to allow sellers to manage their own media
-- NOTE: Run the following in Supabase SQL Editor. If you already use RLS and policies, adapt as needed.

-- Enable RLS (uncomment if you want to enable):
-- ALTER TABLE public.seller_portfolio_media ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert media for themselves (policy name example)
-- CREATE POLICY "sellers_insert_own_media" ON public.seller_portfolio_media
--   FOR INSERT USING (auth.uid() IS NOT NULL) WITH CHECK (seller_id = auth.uid());

-- Allow sellers to delete their own media
-- CREATE POLICY "sellers_delete_own_media" ON public.seller_portfolio_media
--   FOR DELETE USING (seller_id = auth.uid());

-- Allow public select (read) of media (if you want public access to media rows)
-- CREATE POLICY "public_select_media" ON public.seller_portfolio_media
--   FOR SELECT USING (true);

-- 4) Storage guidance
-- Supabase Storage buckets are created via the Supabase dashboard or CLI (not via SQL).
-- Create a bucket named: provider-media
-- Recommended folder structure inside bucket (paths will be stored in DB):
-- provider-media/{userId}/profile/{filename}
-- provider-media/{userId}/cover/{filename}
-- provider-media/{userId}/gallery/{filename}

-- For public access: set the bucket to public (in the Storage settings). Then media files can be addressed via:
-- https://<SUPABASE_URL>/storage/v1/object/public/provider-media/{path}

-- For private buckets: use signed URLs generated server-side (example server route can call createSignedUrl using the service role key).

-- End migration
