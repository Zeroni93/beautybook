"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return setError(error.message)

    // On login success, redirect to a generic dashboard - server can route based on role later
    router.push('/client/dashboard')
  }

  return (
    <div className="px-5 py-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left marketing panel */}
        <div className="space-y-6 scalehub-fade-up animate-soft-float">
          <div className="p-6 scalehub-card">
            <h1 className="text-3xl font-bold">Welcome back to ScaleHub</h1>
            <p className="mt-2 text-gray-300">Manage bookings, availability, services, reviews, and your public booking profile from one dashboard.</p>

            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li>✓ No commissions</li>
              <li>✓ No booking fees</li>
              <li>✓ Keep 100% of your earnings</li>
              <li>✓ QR-code booking links</li>
              <li>✓ Built for local service providers</li>
            </ul>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="p-3 scalehub-card text-center">
                <div className="text-sm text-gray-400">Price</div>
                <div className="font-bold text-white mt-1">$15/mo</div>
              </div>
              <div className="p-3 scalehub-card text-center">
                <div className="text-sm text-gray-400">Commission</div>
                <div className="font-bold text-white mt-1">0%</div>
              </div>
              <div className="p-3 scalehub-card text-center">
                <div className="text-sm text-gray-400">Booking</div>
                <div className="font-bold text-white mt-1">Unlimited</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right sign-in card */}
        <div className="flex justify-center">
          <div className="w-full max-w-md p-6 scalehub-card scalehub-fade-up animate-glow-pulse">
            <h2 className="text-xl font-semibold">Provider Sign In</h2>
            <p className="text-sm text-gray-400 mt-1">Access your ScaleHub dashboard.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Email</label>
                <input type="email" className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="you@business.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Password</label>
                <input type="password" className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              {error && <div className="text-sm text-red-400">{error}</div>}

              <button type="submit" className="w-full py-3 rounded-xl scalehub-button-primary">Sign In</button>

              <div className="text-center text-sm text-gray-400">
                Don't have an account? <a href="/join" className="text-softpink">Create Provider Account</a>
              </div>
              <div className="text-center text-xs text-gray-500">Forgot password? (coming soon)</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
