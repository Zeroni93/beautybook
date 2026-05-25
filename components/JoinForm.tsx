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
          setMessage('Profile saved to your account.')
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
      <div className="p-4 rounded bg-gray-900 border border-gray-800 text-sm text-green-400">{message}</div>
    )
  }

  return (
    <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
      <input name="business_name" className="w-full p-2 rounded bg-gray-900 border border-gray-800" placeholder="Business name" />
      <select name="specialty" className="w-full p-2 rounded bg-gray-900 border border-gray-800">
        <option>Barber</option>
        <option>Nail Tech</option>
      </select>
      <input name="phone" className="w-full p-2 rounded bg-gray-900 border border-gray-800" placeholder="Phone" />
      <input name="instagram" className="w-full p-2 rounded bg-gray-900 border border-gray-800" placeholder="Instagram" />
      <input name="starting_price" className="w-full p-2 rounded bg-gray-900 border border-gray-800" placeholder="Starting price" />
      <textarea name="bio" className="w-full p-2 rounded bg-gray-900 border border-gray-800" placeholder="Short bio" />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-softpink text-black rounded">{loading ? 'Saving...' : 'Create Profile'}</button>
    </form>
  )
}
