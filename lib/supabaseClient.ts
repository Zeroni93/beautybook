import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Note: seller_profiles and appointments require authenticated user IDs. Real inserts should use server-side
// helpers or the Supabase service role with secure API routes. Do NOT use a service role key in frontend code.
