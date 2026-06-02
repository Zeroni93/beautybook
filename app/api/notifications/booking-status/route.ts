import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/resend'

// This endpoint is called when a provider changes booking status (confirmed/declined).
// Currently customers only provide a phone number; we do NOT send emails to customers until a customer_email
// field is added. Instead, we include a placeholder for SMS (Twilio) integration which will be implemented later.

export async function POST(req: Request) {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!SUPABASE_URL) return NextResponse.json({ error: 'Missing NEXT_PUBLIC_SUPABASE_URL env' }, { status: 500 })
    if (!SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY env' }, { status: 500 })

    const body = await req.json()
    const bookingId = body.booking_id
    const newStatus = body.status

    if (!bookingId || !newStatus) return NextResponse.json({ error: 'Missing booking_id or status' }, { status: 400 })

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { data: booking, error: bErr } = await admin.from('booking_requests').select('*').eq('id', bookingId).limit(1).single()
    if (bErr) return NextResponse.json({ error: 'Could not fetch booking_request: ' + bErr.message }, { status: 500 })

    // If customer_email exists in booking row (future), send an email. For now, send placeholder or log.
    const customerEmail = (booking as any).customer_email
    if (customerEmail) {
      const html = `
        <p>Your booking request has been updated.</p>
        <ul>
          <li><strong>Status:</strong> ${newStatus}</li>
          <li><strong>Service:</strong> ${booking.service_name}</li>
          <li><strong>Preferred:</strong> ${booking.preferred_date} ${booking.preferred_time}</li>
        </ul>
      `
      await sendEmail({ to: customerEmail, subject: `Your booking request is ${newStatus}`, html })
      return NextResponse.json({ ok: true })
    }

    // Placeholder: in the future, send SMS via Twilio here using booking.customer_phone
    // Example (pseudocode): twilioClient.messages.create({ to: booking.customer_phone, body: `Your booking was ${newStatus}` })

    console.log('Booking status changed for', bookingId, 'to', newStatus, 'customer phone:', booking.customer_phone)

    return NextResponse.json({ ok: true, note: 'Customer has no email; consider SMS via Twilio (not implemented).' })
  } catch (err: any) {
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 })
  }
}
