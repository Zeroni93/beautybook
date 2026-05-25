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
    <div className="px-5 py-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input type="email" className="w-full p-2 rounded bg-gray-900 border border-gray-800" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 rounded bg-gray-900 border border-gray-800" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="text-sm text-red-400">{error}</div>}
        <button type="submit" className="px-4 py-2 bg-softpink text-black rounded">Sign in</button>
      </form>
    </div>
  )
}
