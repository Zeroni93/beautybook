"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function BookingForm({ sellerId, services }: { sellerId: string, services: any[] }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [serviceId, setServiceId] = useState<string | null>(services.length ? String(services[0].id) : null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    if (!name || !phone) {
      setMessage('Please provide your name and phone number.')
      return
    }

    if (!date || !time) {
      setMessage('Please select a preferred date and time.')
      return
    }

    setLoading(true)
    try {
      // read seller confirmation mode
      const { data: profileData } = await supabase.from('seller_profiles').select('booking_confirmation_mode').eq('user_id', sellerId).limit(1)
      const booking_confirmation_mode = profileData?.[0]?.booking_confirmation_mode || 'manual'

      // check for existing bookings at this slot
      const { data: conflicts, error: cErr } = await supabase.from('booking_requests')
        .select('id, status')
        .eq('seller_id', sellerId)
        .eq('preferred_date', date)
        .eq('preferred_time', time)
        .in('status', ['confirmed','pending'])

      if (cErr) console.warn('conflict check error', cErr)
      if (conflicts && conflicts.length > 0) {
        const hasConfirmed = conflicts.some((x:any) => x.status === 'confirmed')
        setMessage(hasConfirmed ? 'That time is already booked. Please choose a different time.' : 'That time is already requested. Please choose another time.')
        setLoading(false)
        return
      }

      const selected = services.find((s: any) => String(s.id) === String(serviceId))
      const service_name = selected?.name || ''

      const status = booking_confirmation_mode === 'automatic' ? 'confirmed' : 'pending'

      const { error } = await supabase.from('booking_requests').insert({
        seller_id: sellerId,
        customer_name: name,
        customer_phone: phone,
        service_id: serviceId || null,
        service_name,
        preferred_date: date || null,
        preferred_time: time || null,
        notes,
        status,
        confirmation_mode: booking_confirmation_mode
      })

      if (error) {
        setMessage('Could not send booking request: ' + error.message)
        setMessageType('error')
      } else {
  setMessage('The provider received your request and will confirm by phone or text.')
  setMessageType('success')
        // Notify provider via server-side notifications endpoint (does not expose RESEND_API_KEY)
        try {
          // send booking data to server notification route; server will look up provider email and send
          await fetch('/api/notifications/booking-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ booking: {
              seller_id: sellerId,
              customer_name: name,
              customer_phone: phone,
              service_id: serviceId || null,
              service_name,
              preferred_date: date || null,
              preferred_time: time || null,
              notes,
              status,
              confirmation_mode: booking_confirmation_mode
            }})
          })
        } catch (notifyErr) {
          console.warn('Could not send provider notification:', notifyErr)
        }

        setName(''); setPhone(''); setDate(''); setTime(''); setNotes('')
      }
    } catch (err: any) {
      setMessage('Error: ' + String(err.message || err))
      setMessageType('error')
    }
    setLoading(false)
  }

  return (
    <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
  <input className="w-full input-field" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
  <input className="w-full input-field" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
  <select className="w-full input-field" value={serviceId ?? ''} onChange={(e) => setServiceId(e.target.value)}>
        {services.length === 0 && <option value="">Default service</option>}
        {services.map((s: any) => <option key={s.id} value={s.id}>{s.name} — {s.price}</option>)}
      </select>
  <input type="date" className="w-full input-field" value={date} onChange={(e) => setDate(e.target.value)} />
  <input type="time" className="w-full input-field" value={time} onChange={(e) => setTime(e.target.value)} />
  <textarea className="w-full input-field" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
  <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Sending...' : 'Request Booking'}</button>

      {/* Message area */}
      {messageType === 'success' && (
        <div className="mt-2 p-4 rounded-lg bg-green-900/40 border border-green-700 text-green-200">
          <div className="font-semibold">Booking Request Sent</div>
          <div className="text-sm mt-1">The provider received your request and will confirm by phone or text.</div>
        </div>
      )}

      {messageType === 'error' && message && (
        <div className="mt-2 p-3 rounded-lg bg-red-900/40 border border-red-700 text-red-200 text-sm">{message}</div>
      )}
    </form>
  )
}
