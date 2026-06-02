"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ClientAppointments() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user ?? null
      if (!user) {
        setAppointments([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase.from('appointments').select('*').eq('customer_id', user.id).order('requested_at', { ascending: false })
      if (error) {
        console.error('Could not load appointments', error)
        setAppointments([])
      } else if (mounted) {
        setAppointments(data || [])
      }
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <div>Loading your appointments...</div>
  if (appointments.length === 0) return <div>No appointments yet — make a booking!</div>

  return (
    <div className="space-y-3">
      {appointments.map((a) => (
  <div key={a.id} className="p-3 scalehub-card rounded border border-gray-800">
          <div className="text-sm text-gray-300">Service: {a.service_name || 'Service'}</div>
          <div className="text-sm text-gray-400">Status: {a.status}</div>
          <div className="text-sm text-gray-400">Requested: {new Date(a.requested_at).toLocaleString()}</div>
          {a.scheduled_for && <div className="text-sm text-gray-400">Scheduled: {new Date(a.scheduled_for).toLocaleString()}</div>}
          {a.notes && <div className="text-sm text-gray-400 mt-2">Notes: {a.notes}</div>}
        </div>
      ))}
    </div>
  )
}
