"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import DeleteAccount from './DeleteAccount'
import ProviderQRCode from './ProviderQRCode'
import MediaGallery from './MediaGallery'

export default function ProviderDashboardClient() {
  const router = useRouter()
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [services, setServices] = useState<any[]>([])
  const [availability, setAvailability] = useState<any[]>([])
  const [bookingRequests, setBookingRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [requestLoadingIds, setRequestLoadingIds] = useState<string[]>([])

  useEffect(() => {
    let mounted = true

    async function init() {
      const { data } = await supabase.auth.getSession()
      const loggedUser = data.session?.user ?? null
      if (!loggedUser) {
        router.push('/auth/login')
        return
      }
      if (!mounted) return
      setUser(loggedUser)

      // fetch profile
      const { data: profiles, error: pErr } = await supabase.from('seller_profiles').select('*').eq('user_id', loggedUser.id).limit(1)
      if (pErr) console.warn('profile fetch error', pErr)
      const pf = profiles && profiles[0]
      setProfile(pf ?? null)

  // fetch services
      const { data: svc, error: sErr } = await supabase.from('services').select('*').eq('seller_id', loggedUser.id)
      if (sErr) console.warn('services fetch error', sErr)
      setServices(svc || [])

    // fetch booking_requests for this seller
    const { data: br, error: brErr } = await supabase.from('booking_requests').select('*').eq('seller_id', loggedUser.id).order('created_at', { ascending: false })
    if (brErr) console.warn('booking_requests fetch error', brErr)
    setBookingRequests(br || [])

  // fetch availability rules
  const { data: avail, error: availErr } = await supabase.from('availability_rules').select('*').eq('seller_id', loggedUser.id)
  if (availErr) console.warn('availability fetch error', availErr)
  setAvailability(avail || [])

      setLoading(false)
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) router.push('/auth/login')
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [router])

  async function refreshServices() {
    if (!user) return
    const { data: svc, error } = await supabase.from('services').select('*').eq('seller_id', user.id)
    if (error) console.warn('refresh services error', error)
    setServices(svc || [])
  }

  async function refreshAvailability() {
    if (!user) return
    const { data, error } = await supabase.from('availability_rules').select('*').eq('seller_id', user.id)
    if (error) console.warn('refresh availability error', error)
    setAvailability(data || [])
  }

  async function refreshBookingRequests() {
    if (!user) return
    const { data, error } = await supabase.from('booking_requests').select('*').eq('seller_id', user.id).order('created_at', { ascending: false })
    if (error) console.warn('refresh booking_requests error', error)
    setBookingRequests(data || [])
  }

  if (loading) return (
    <div className="px-5 py-8 max-w-3xl mx-auto">
      <div className="grid gap-4">
        <div className="h-20 rounded-2xl skeleton" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-40 rounded-2xl skeleton" />
          <div className="h-40 rounded-2xl skeleton" />
        </div>
        <div className="h-32 rounded-2xl skeleton" />
      </div>
    </div>
  )

  return (
    <div className="px-5 py-8 max-w-3xl mx-auto">
  <h1 className="text-2xl font-bold scalehub-fade-up">Service Provider Dashboard</h1>

      {profile ? (
  <div className="mt-4 p-4 scalehub-card scalehub-fade-up anim-smooth">
          <div className="text-lg font-semibold">{profile.business_name}</div>
          <div className="text-sm text-gray-400">{profile.specialty} • {profile.city}, {profile.state}</div>
          <div className="mt-2 text-sm text-gray-300">{profile.bio}</div>
          <div className="mt-2 text-sm text-gray-400">Service Area: <span className="font-medium">{profile.service_area || 'Las Vegas and surrounding areas'}</span></div>
          <div className="mt-2 inline-block px-2 py-1 rounded bg-gray-800 text-cyan-300 text-xs font-semibold">Verified Provider</div>
          <div className="mt-2 text-sm">Instagram: <a className="text-softpink" href={`https://instagram.com/${profile.instagram_handle}`}>@{profile.instagram_handle}</a></div>
          <div className="mt-2 text-sm">Accepting appointments: <span className="font-medium">{profile.accepts_new_appointments ? 'Yes' : 'No'}</span></div>
        </div>
      ) : (
        <div className="mt-4 p-4 scalehub-card text-sm text-gray-300">No profile found. Complete your profile in Join.</div>
      )}

      {/* QR Code section */}
      {profile && (
  <div className="mt-6 scalehub-fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ProviderQRCode providerId={profile.user_id} />
            <div>
              <MediaGallery userId={profile.user_id} />
            </div>

            <div className="p-4 scalehub-card scalehub-fade-up card-hover">
              <div className="text-sm font-semibold text-white">Your Public Booking Page</div>
              <div className="text-sm text-gray-400 mt-1">Share this page with customers so they can book directly.</div>
              <div className="mt-3 flex items-center gap-2">
                <input readOnly value={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/providers/${profile.user_id}`} className="input-field bg-transparent text-sm flex-1" />
                <button onClick={() => {
                  const url = (process.env.NEXT_PUBLIC_SITE_URL && `${process.env.NEXT_PUBLIC_SITE_URL}/providers/${profile.user_id}`) || (typeof window !== 'undefined' ? `${window.location.origin}/providers/${profile.user_id}` : `http://localhost:3000/providers/${profile.user_id}`)
                  navigator.clipboard.writeText(url)
                }} className="px-3 py-1 rounded scalehub-button-secondary text-sm">Copy Link</button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <a target="_blank" rel="noreferrer" href={(process.env.NEXT_PUBLIC_SITE_URL && `${process.env.NEXT_PUBLIC_SITE_URL}/providers/${profile.user_id}`) || (typeof window !== 'undefined' ? `${window.location.origin}/providers/${profile.user_id}` : `http://localhost:3000/providers/${profile.user_id}`)} className="px-3 py-1 rounded btn-primary text-white text-sm">Open Profile</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription card (mock) */}
  <div className="mt-4 p-4 scalehub-card scalehub-fade-up card-hover">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">Current Plan</div>
            <div className="font-medium">ScaleHub Provider Plan</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Price</div>
            <div className="font-medium">$15/month</div>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-300">Flat monthly fee. No commissions or booking fees — you keep 100% of what you earn.</div>
      </div>

  <section className="mt-6 scalehub-fade-up">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Services</h2>
        </div>

        <div className="mt-3 grid gap-3">
          {services.length === 0 && <div className="text-sm text-gray-400">No services yet.</div>}

          {services.map((s) => (
            <div key={s.id} className="scalehub-glow-card p-3 anim-smooth card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{s.name}</div>
                  <div className="text-sm text-gray-400">{s.category} • {s.duration || '—'}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{s.price}</div>
                  <div className="text-sm text-gray-400">{s.is_active ? 'Active' : 'Inactive'}</div>
                </div>
              </div>
              {s.deposit && <div className="mt-2 text-sm text-gray-400">Deposit: {s.deposit}</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
  <h3 className="text-lg font-semibold scalehub-fade-up">Booking Requests</h3>
        <div className="mt-3 grid gap-3">
          {bookingRequests.length === 0 && <div className="text-sm text-gray-400">No booking requests yet.</div>}

          {bookingRequests.map((a) => (
            <div key={a.id} className="scalehub-glow-card p-3 anim-smooth card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-medium text-white">{a.service_name || 'Service'}</div>
                  <div className="text-sm text-gray-400">Preferred: {a.preferred_date || '—'} {a.preferred_time || ''}</div>
                  <div className="mt-2">
                    {/* Booking status timeline */}
                        <div className="flex items-center gap-2 text-xs">
                          {(() => {
                            const isRequested = ['requested', 'pending'].includes(a.status)
                            return (
                              <>
                                <div className={`px-2 py-1 rounded-full ${isRequested ? 'bg-[var(--brand-primary)] text-white' : 'bg-gray-800 text-gray-400'}`}>Requested</div>
                                <div className={`px-2 py-1 rounded-full ${a.status === 'confirmed' ? 'bg-[var(--brand-primary)] text-white' : 'bg-gray-800 text-gray-400'}`}>Confirmed</div>
                                <div className={`px-2 py-1 rounded-full ${a.status === 'completed' ? 'bg-[var(--brand-primary)] text-white' : 'bg-gray-800 text-gray-400'}`}>Completed</div>
                              </>
                            )
                          })()}
                        </div>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">Customer: {a.customer_name} • {a.customer_phone}</div>
                  {a.notes && <div className="text-sm text-gray-300 mt-2">Notes: {a.notes}</div>}
                </div>
                <div className="flex flex-col gap-2">
                  <button disabled={requestLoadingIds.includes(a.id)} onClick={async () => {
                    // confirm
                    setRequestLoadingIds((s) => [...s, a.id])
                    const { error } = await supabase.from('booking_requests').update({ status: 'confirmed' }).eq('id', a.id).eq('seller_id', user.id)
                    if (error) console.warn('confirm error', error)
                    else {
                      refreshBookingRequests()
                      try {
                        await fetch('/api/notifications/booking-status', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ booking_id: a.id, status: 'confirmed' })
                        })
                      } catch (notifyErr) {
                        console.warn('notify booking status error', notifyErr)
                      }
                    }
                    setRequestLoadingIds((s) => s.filter((id) => id !== a.id))
                  }} className="px-3 py-1 rounded bg-green-600 hover:bg-green-500 text-sm anim-smooth hover:scale-105 active:scale-95">{requestLoadingIds.includes(a.id) ? 'Processing...' : 'Confirm'}</button>

                  <button disabled={requestLoadingIds.includes(a.id)} onClick={async () => {
                    setRequestLoadingIds((s) => [...s, a.id])
                    const { error } = await supabase.from('booking_requests').update({ status: 'declined' }).eq('id', a.id).eq('seller_id', user.id)
                    if (error) console.warn('decline error', error)
                    else {
                      refreshBookingRequests()
                      try {
                        await fetch('/api/notifications/booking-status', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ booking_id: a.id, status: 'declined' })
                        })
                      } catch (notifyErr) {
                        console.warn('notify booking status error', notifyErr)
                      }
                    }
                    setRequestLoadingIds((s) => s.filter((id) => id !== a.id))
                  }} className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-sm anim-smooth hover:scale-105 active:scale-95">{requestLoadingIds.includes(a.id) ? 'Processing...' : 'Decline'}</button>

                  <button disabled={requestLoadingIds.includes(a.id)} onClick={async () => {
                    setRequestLoadingIds((s) => [...s, a.id])
                    const { error } = await supabase.from('booking_requests').update({ status: 'completed' }).eq('id', a.id).eq('seller_id', user.id)
                    if (error) console.warn('complete error', error)
                    else {
                      refreshBookingRequests()
                      try {
                        await fetch('/api/notifications/booking-status', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ booking_id: a.id, status: 'completed' })
                        })
                      } catch (notifyErr) {
                        console.warn('notify booking status error', notifyErr)
                      }
                    }
                    setRequestLoadingIds((s) => s.filter((id) => id !== a.id))
                  }} className="px-3 py-1 rounded scalehub-button-secondary text-sm anim-smooth hover:scale-105 active:scale-95">{requestLoadingIds.includes(a.id) ? 'Processing...' : 'Mark Completed'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Add Service</h3>
          <div className="mt-3">
            <AddServiceForm userId={user?.id} onAdded={refreshServices} />
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-lg font-semibold">Availability</h3>

        <div className="mt-3 grid gap-3">
          {availability.length === 0 && <div className="text-sm text-gray-400">No availability rules yet.</div>}

          {availability.map((r) => (
            <div key={r.id} className="scalehub-glow-card p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][r.day_of_week]}</div>
                <div className="text-sm text-gray-400">{r.starts_at} — {r.ends_at} • every {r.slot_interval_minutes} min • {r.timezone || 'America/Los_Angeles'}</div>
              </div>
              <div>
                <button onClick={async () => {
                  const { error } = await supabase.from('availability_rules').delete().eq('id', r.id).eq('seller_id', user.id)
                  if (error) console.warn('delete availability error', error)
                  else refreshAvailability()
                }} className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <AddAvailabilityForm userId={user?.id} onAdded={refreshAvailability} />
        </div>
      </section>

      <section className="mt-6 p-4 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-300">
        Availability setup coming next.
      </section>

      <div className="mt-6">
        <DeleteAccount />
      </div>
    </div>
  )
}

function AddServiceForm({ userId, onAdded }: { userId: string, onAdded: () => void }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [deposit, setDeposit] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setLoading(true)
    const { error } = await supabase.from('services').insert({
      seller_id: userId,
      name,
      price,
      duration,
      deposit,
      description,
      category,
      is_active: true
    })
    if (error) console.warn('insert service error', error)
    else {
      setName(''); setPrice(''); setDuration(''); setDeposit(''); setDescription(''); setCategory('')
      onAdded()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Service name" className="w-full input-field" />
      <div className="grid grid-cols-2 gap-2">
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="input-field" />
        <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration" className="input-field" />
      </div>
      <input value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="Deposit" className="w-full input-field" />
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="w-full input-field" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full input-field" />
      <div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-softpink text-black rounded">{loading ? 'Adding...' : 'Add Service'}</button>
      </div>
    </form>
  )
}

function AddAvailabilityForm({ userId, onAdded }: { userId?: string, onAdded: () => void }) {
  const [day, setDay] = useState('1')
  const [startsAt, setStartsAt] = useState('09:00')
  const [endsAt, setEndsAt] = useState('17:00')
  const [interval, setInterval] = useState('30')
  const timezone = 'America/Los_Angeles'
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setLoading(true)
    const { error } = await supabase.from('availability_rules').insert({
      seller_id: userId,
      day_of_week: Number(day),
      starts_at: startsAt,
      ends_at: endsAt,
      slot_interval_minutes: Number(interval),
      timezone
    })
    if (error) console.warn('insert availability error', error)
    else onAdded()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <select value={day} onChange={(e) => setDay(e.target.value)} className="input-field">
          <option value="0">Sunday</option>
          <option value="1">Monday</option>
          <option value="2">Tuesday</option>
          <option value="3">Wednesday</option>
          <option value="4">Thursday</option>
          <option value="5">Friday</option>
          <option value="6">Saturday</option>
        </select>
        <input type="time" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="input-field" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input type="time" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="input-field" />
        <input value={interval} onChange={(e) => setInterval(e.target.value)} placeholder="Slot interval (minutes)" className="input-field" />
      </div>
      <div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-softpink text-black rounded">{loading ? 'Saving...' : 'Add Availability'}</button>
      </div>
    </form>
  )
}
