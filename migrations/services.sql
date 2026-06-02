-- Migration: Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.seller_profiles(user_id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text,
  price numeric,
  duration integer,
  deposit numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT timezone('utc', now()),
  updated_at timestamptz DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_services_seller_id ON public.services (seller_id);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON public.services (is_active);

-- Enable RLS and example policies (uncomment and adapt in Supabase SQL editor)
-- ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "public_select_active_services" ON public.services
--   FOR SELECT USING (is_active = true);
-- CREATE POLICY "sellers_insert_own_services" ON public.services
--   FOR INSERT WITH CHECK (seller_id = auth.uid());
-- CREATE POLICY "sellers_update_own_services" ON public.services
--   FOR UPDATE USING (seller_id = auth.uid()) WITH CHECK (seller_id = auth.uid());
-- CREATE POLICY "sellers_delete_own_services" ON public.services
--   FOR DELETE USING (seller_id = auth.uid());
