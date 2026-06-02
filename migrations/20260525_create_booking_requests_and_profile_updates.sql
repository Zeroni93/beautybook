-- Migration: Create booking_requests table and add booking_confirmation_mode to seller_profiles

-- 1) Create booking_requests table
CREATE TABLE IF NOT EXISTS public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES public.seller_profiles(user_id) ON DELETE CASCADE,
  customer_name text,
  customer_phone text,
  service_id uuid NULL REFERENCES public.services(id) ON DELETE SET NULL,
  service_name text,
  preferred_date date,
  preferred_time time,
  notes text,
  status text DEFAULT 'pending',
  confirmation_mode text DEFAULT 'manual',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2) Add booking_confirmation_mode to seller_profiles if missing
ALTER TABLE public.seller_profiles
  ADD COLUMN IF NOT EXISTS booking_confirmation_mode text DEFAULT 'manual';

-- 3) Add trigger to update updated_at on change (optional)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_booking_requests_updated_at ON public.booking_requests;
CREATE TRIGGER trg_booking_requests_updated_at
BEFORE UPDATE ON public.booking_requests
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- End migration
