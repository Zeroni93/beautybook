"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'customer'|'seller'>('customer')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { role } } })
    if (error) return setError(error.message)

    // On successful signup, redirect based on role
    if (role === 'customer') router.push('/client/dashboard')
    else router.push('/join')
  }

  return (
    <div className="px-5 py-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Create an account</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input type="email" className="w-full p-2 rounded bg-gray-900 border border-gray-800" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 rounded bg-gray-900 border border-gray-800" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex gap-2 items-center">
          <label className="text-sm">
            <input type="radio" name="role" value="customer" checked={role==='customer'} onChange={() => setRole('customer')} /> Customer
          </label>
          <label className="text-sm">
            <input type="radio" name="role" value="seller" checked={role==='seller'} onChange={() => setRole('seller')} /> Seller
          </label>
        </div>
        {error && <div className="text-sm text-red-400">{error}</div>}
        <button type="submit" className="px-4 py-2 bg-softpink text-black rounded">Sign up</button>
      </form>
    </div>
  )
}
