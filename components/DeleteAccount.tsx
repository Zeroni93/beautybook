"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function DeleteAccount() {
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault()
    if (confirm !== 'DELETE') {
      setMessage('Type DELETE to confirm account deletion')
      return
    }
    setMessage(null)
    setLoading(true)

    // Call secure server API which will use the service role key to delete the user
    try {
      const { data } = await supabase.auth.getSession()
      const accessToken = data.session?.access_token
      if (!accessToken) {
        setMessage('No active session found. Please log in again.')
        setLoading(false)
        return
      }

  const res = await fetch('/api/delete-account', { method: 'POST', headers: { 'Authorization': `Bearer ${accessToken}` } })
      if (!res.ok) {
        const text = await res.text()
        setMessage('Deletion failed: ' + text)
        setLoading(false)
        return
      }

      // sign out locally
      await supabase.auth.signOut()
      setMessage('Account deleted. Redirecting...')
      setTimeout(() => router.push('/'), 1500)
    } catch (err: any) {
      setMessage('Error: ' + String(err.message || err))
    }
    setLoading(false)
  }

  return (
    <div className="mt-8 p-4 rounded-lg border border-red-700 bg-gradient-to-br from-red-900 to-red-800 text-white">
      <h3 className="text-lg font-semibold">Delete account</h3>
      <p className="text-sm text-red-200 mt-2">Warning: deleting your account is irreversible. Your profile and related data will be removed.</p>

      <form onSubmit={handleDelete} className="mt-3 space-y-3">
        <div className="text-sm">Type <span className="font-mono">DELETE</span> to confirm</div>
        <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-800" placeholder="Type DELETE" />
        <div className="flex items-center gap-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white">{loading ? 'Deleting...' : 'Delete account'}</button>
          {message && <div className="text-sm text-red-200">{message}</div>}
        </div>
      </form>
    </div>
  )
}
