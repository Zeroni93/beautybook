"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function BookingForm({ sellerId, services }: { sellerId: string, services: any[] }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [serviceId, setServiceId] = useState<string | null>(services.length ? String(services[0].id) : null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user ?? null
    if (!user) {
      setMessage('Please log in as a customer to request an appointment.')
      router.push('/auth/login')
      return
    }

    setLoading(true)
    try {
      const selected = services.find((s: any) => String(s.id) === String(serviceId))
      const service_name = selected?.name || ''
      const scheduled_for = date && time ? new Date(`${date}T${time}:00`).toISOString() : null

      const { error } = await supabase.from('appointments').insert({
        customer_id: user.id,
        seller_id: sellerId,
        service_name,
        service_id: serviceId || null,
        requested_at: new Date().toISOString(),
        scheduled_for,
        notes,
        status: 'pending'
      })

      if (error) {
        setMessage('Could not send booking request: ' + error.message)
      } else {
        setMessage('Booking request sent. The provider will review your appointment.')
        setName(''); setPhone(''); setDate(''); setTime(''); setNotes('')
      }
    } catch (err: any) {
      setMessage('Error: ' + String(err.message || err))
    }
    setLoading(false)
  }

  return (
    <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
      <input className="w-full p-2 rounded bg-gray-900 border border-gray-800" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full p-2 rounded bg-gray-900 border border-gray-800" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <select className="w-full p-2 rounded bg-gray-900 border border-gray-800" value={serviceId ?? ''} onChange={(e) => setServiceId(e.target.value)}>
        {services.length === 0 && <option value="">Default service — $25</option>}
        {services.map((s: any) => <option key={s.id} value={s.id}>{s.name} — {s.price}</option>)}
      </select>
      <input type="date" className="w-full p-2 rounded bg-gray-900 border border-gray-800" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" className="w-full p-2 rounded bg-gray-900 border border-gray-800" value={time} onChange={(e) => setTime(e.target.value)} />
      <textarea className="w-full p-2 rounded bg-gray-900 border border-gray-800" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-softpink text-black rounded">{loading ? 'Sending...' : 'Send Request'}</button>
      {message && <div className="text-sm mt-2 text-green-400">{message}</div>}
    </form>
  )
}
