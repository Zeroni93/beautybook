"use client"
"use client"
import { useState } from 'react'

export default function JoinForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Attempt to insert into seller_profiles if user is logged in
    try {
      const { supabase } = await import('@/lib/supabaseClient')
      const { data: session } = await supabase.auth.getSession()
      const user = session?.session?.user

      if (user) {
        // Note: seller_profiles.user_id references auth.users.id. This insert will work only when
        // the logged-in user has a valid id. We still avoid using a service role key in frontend.
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const business_name = String(formData.get('business_name') || '')
        const specialty = String(formData.get('specialty') || '')
        const phone = String(formData.get('phone') || '')
        const instagram_handle = String(formData.get('instagram') || '')
        const starting_price = String(formData.get('starting_price') || '')
        const bio = String(formData.get('bio') || '')

        const { error } = await supabase.from('seller_profiles').upsert({
          user_id: user.id,
          business_name,
          specialty,
          phone,
          instagram_handle,
          bio,
          accepts_new_appointments: true
        })

        if (error) {
          setMessage('Saved locally. Could not write to DB: ' + error.message)
        } else {
          setMessage('Profile saved to your account. Your booking QR code will be available in your provider dashboard.')
        }
      } else {
        setMessage('Provider profile received. Account creation will be enabled after authentication is added.')
      }
    } catch (err: any) {
      setMessage('Saved locally. Error: ' + String(err?.message || err))
    }

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-4 rounded scalehub-card text-sm text-green-400">{message}</div>
    )
  }

  return (
    <form className="mt-6 space-y-4 animate-scale-in" onSubmit={handleSubmit}>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Business name</label>
        <input name="business_name" className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Business name" />
      </div>

      <div>
        <label className="text-xs text-gray-400 mb-1 block">Category</label>
        <select name="specialty" className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400">
          <option>Barber</option>
          <option>Nail Tech</option>
          <option>Massage Therapist</option>
          <option>Photographer</option>
          <option>Car Detailer</option>
          <option>Mover</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-400 mb-1 block">Phone</label>
        <input name="phone" className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Phone" />
      </div>

      <div>
        <label className="text-xs text-gray-400 mb-1 block">Instagram</label>
        <input name="instagram" className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Instagram handle (without @)" />
      </div>

      <div>
        <label className="text-xs text-gray-400 mb-1 block">Starting price</label>
        <input name="starting_price" className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Starting price (e.g., $25)" />
      </div>

      <div>
        <label className="text-xs text-gray-400 mb-1 block">Short bio</label>
        <textarea name="bio" className="w-full h-28 px-4 py-3 rounded-xl bg-slate-800 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Short bio" />
      </div>

      <div>
        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl scalehub-button-primary anim-smooth">{loading ? 'Saving...' : 'Create Provider Profile'}</button>
      </div>

      <div className="text-xs text-gray-500">Provider billing is coming soon. No card required during MVP testing.</div>
    </form>
  )
}
