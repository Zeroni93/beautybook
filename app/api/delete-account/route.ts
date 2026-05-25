import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!SUPABASE_URL) return NextResponse.json({ error: 'Missing NEXT_PUBLIC_SUPABASE_URL env' }, { status: 500 })
    if (!SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY env' }, { status: 500 })

    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Missing access token' }, { status: 401 })
    const accessToken = authHeader.split(' ')[1]

    // Validate token and get user via Supabase auth endpoint
    const resp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })

    if (!resp.ok) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    const user = await resp.json()
    const uid = user?.id
    if (!uid) return NextResponse.json({ error: 'Could not get user id' }, { status: 400 })

    // Use service role to delete the user
    const admin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    const { error } = await admin.auth.admin.deleteUser(uid)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 })
  }
}
