"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ReviewForm({ providerId }: { providerId: string }) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (!name || !rating) return setMessage('Please provide a name and rating')
    setLoading(true)
    try {
      const { error } = await supabase.from('provider_reviews').insert({ provider_id: providerId, customer_name: name, rating, review_text: text })
      if (error) {
        setMessage('Could not submit review: ' + error.message)
      } else {
        setMessage('Thank you — your review was submitted')
        setName(''); setRating(5); setText('')
        // Refresh the server component to show the new review
        try { router.refresh() } catch (e) { /* noop */ }
      }
    } catch (err: any) {
      setMessage('Error: ' + String(err.message || err))
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 p-3 scalehub-card max-w-[700px]">
      <div className="text-sm font-semibold">Leave a review</div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full input-field h-11" />
      <div className="flex items-center gap-2">
        <label className="text-sm">Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="input-field w-24 h-11">
          {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a short review (optional)" className="w-full input-field h-[100px] resize-none" />
      <div className="flex items-center justify-between">
        <button type="submit" disabled={loading} className="px-4 py-2 scalehub-button-primary rounded font-semibold">{loading ? 'Submitting...' : 'Submit Review'}</button>
        {message && <div className="text-sm text-gray-300">{message}</div>}
      </div>
    </form>
  )
}
