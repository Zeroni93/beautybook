import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!SUPABASE_URL) return NextResponse.json({ error: 'Missing NEXT_PUBLIC_SUPABASE_URL env' }, { status: 500 })
    if (!SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY env' }, { status: 500 })

    const body = await req.json()
    // Accept either a booking_request object or an id
    const booking = body.booking || null
    const bookingId = body.booking_id || null

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    let bookingData = booking
    if (!bookingData && bookingId) {
      const { data, error } = await admin.from('booking_requests').select('*').eq('id', bookingId).limit(1).single()
      if (error) return NextResponse.json({ error: 'Could not fetch booking_request: ' + error.message }, { status: 500 })
      bookingData = data
    }

    if (!bookingData) return NextResponse.json({ error: 'Missing booking data' }, { status: 400 })

    // Fetch provider email from seller_profiles
    const { data: profileData, error: pErr } = await admin.from('seller_profiles').select('user_id, business_name, full_name, email').eq('user_id', bookingData.seller_id).limit(1).single()
    if (pErr) {
      // It's important this route doesn't expose service keys; we use admin client server-side only.
      return NextResponse.json({ error: 'Could not fetch seller profile: ' + pErr.message }, { status: 500 })
    }

    const providerEmail = profileData?.email
    const providerName = profileData?.business_name || profileData?.full_name || 'Provider'

    if (!providerEmail) {
      // Provider has no email on file; return success but log; future: send SMS
      console.warn('Provider does not have an email address:', bookingData.seller_id)
      return NextResponse.json({ ok: true, note: 'Provider has no email' })
    }

    const html = `
      <p>New booking request from ${bookingData.customer_name}</p>
      <ul>
        <li><strong>Phone:</strong> ${bookingData.customer_phone}</li>
        <li><strong>Service:</strong> ${bookingData.service_name || 'Not specified'}</li>
        <li><strong>Preferred date:</strong> ${bookingData.preferred_date || 'Any'}</li>
        <li><strong>Preferred time:</strong> ${bookingData.preferred_time || 'Any'}</li>
        <li><strong>Notes:</strong> ${bookingData.notes || 'None'}</li>
      </ul>
      <p>Please confirm or decline this request in your provider dashboard.</p>
    `

    await sendEmail({
      to: providerEmail,
      subject: `New booking request from ${bookingData.customer_name}`,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 })
  }
}
