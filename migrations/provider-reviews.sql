-- Migration: Create provider_reviews table
CREATE TABLE IF NOT EXISTS public.provider_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.seller_profiles(user_id) ON DELETE CASCADE,
  booking_request_id uuid REFERENCES public.booking_requests(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text text,
  created_at timestamptz DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON public.provider_reviews (provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.provider_reviews (rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.provider_reviews (created_at);

-- RLS guidance
-- ALTER TABLE public.provider_reviews ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "public_select_reviews" ON public.provider_reviews
--   FOR SELECT USING (true);
-- CREATE POLICY "public_insert_reviews" ON public.provider_reviews
--   FOR INSERT USING (true) WITH CHECK (rating BETWEEN 1 AND 5);
-- -- Providers should NOT be able to update or delete customer reviews from frontend
-- CREATE POLICY "no_update_delete_reviews" ON public.provider_reviews
--   FOR UPDATE USING (false);
-- CREATE POLICY "no_delete_reviews" ON public.provider_reviews
--   FOR DELETE USING (false);

-- TODO: Future improvement: require completed booking_request before allowing review insertion (check booking_request.status = 'completed').
