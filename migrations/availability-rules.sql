-- Migration: Create availability_rules table
CREATE TABLE IF NOT EXISTS public.availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.seller_profiles(user_id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  starts_at time NOT NULL,
  ends_at time NOT NULL,
  slot_interval_minutes integer NOT NULL DEFAULT 30,
  timezone text NOT NULL DEFAULT 'America/Los_Angeles',
  created_at timestamptz DEFAULT timezone('utc', now()),
  updated_at timestamptz DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_avail_seller_id ON public.availability_rules (seller_id);
CREATE INDEX IF NOT EXISTS idx_avail_day_of_week ON public.availability_rules (day_of_week);

-- RLS guidance
-- ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "public_select_availability" ON public.availability_rules
--   FOR SELECT USING (true);
-- CREATE POLICY "sellers_insert_own_availability" ON public.availability_rules
--   FOR INSERT WITH CHECK (seller_id = auth.uid());
-- CREATE POLICY "sellers_update_own_availability" ON public.availability_rules
--   FOR UPDATE USING (seller_id = auth.uid()) WITH CHECK (seller_id = auth.uid());
-- CREATE POLICY "sellers_delete_own_availability" ON public.availability_rules
--   FOR DELETE USING (seller_id = auth.uid());
