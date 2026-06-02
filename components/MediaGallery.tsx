"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { publicUrlFor, uploadFile, removeFile, createSignedUrl } from '@/lib/storage'
import { getSafeImageSrc } from '@/lib/image'

export default function MediaGallery({ userId }: { userId: string }) {
  const [profilePath, setProfilePath] = useState<string | null>(null)
  const [coverPath, setCoverPath] = useState<string | null>(null)
  const [gallery, setGallery] = useState<Array<any>>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!userId) return
      // fetch profile paths from seller_profiles
      const { data: profiles } = await supabase.from('seller_profiles').select('profile_photo_path,cover_photo_path').eq('user_id', userId).limit(1)
      const pf = profiles?.[0]
      if (!mounted) return
      setProfilePath(pf?.profile_photo_path ?? null)
      setCoverPath(pf?.cover_photo_path ?? null)

      // fetch gallery rows
      const { data: media } = await supabase.from('seller_portfolio_media').select('*').eq('seller_id', userId).order('created_at', { ascending: false })
      if (!mounted) return
      setGallery(media || [])
    }
    load()
    return () => { mounted = false }
  }, [userId])

  async function handleUpload(file: File, type: 'profile' | 'cover' | 'gallery') {
    if (!userId) return
    setLoading(true); setMessage(null)
    try {
      const folder = type === 'gallery' ? 'gallery' : type
      const path = await uploadFile(userId, folder, file)

      if (type === 'profile' || type === 'cover') {
        // update seller_profiles
        const updates: any = {}
        updates[ type === 'profile' ? 'profile_photo_path' : 'cover_photo_path' ] = path
        const { error } = await supabase.from('seller_profiles').update(updates).eq('user_id', userId)
        if (error) throw error
        if (type === 'profile') setProfilePath(path)
        else setCoverPath(path)
      } else {
        // insert gallery record
        const { error } = await supabase.from('seller_portfolio_media').insert({ seller_id: userId, path })
        if (error) throw error
        setGallery((g) => [{ path, id: Math.random().toString(36).slice(2), created_at: new Date().toISOString() }, ...g])
      }
      setMessage('Upload successful')
    } catch (err: any) {
      console.warn('upload error', err)
      setMessage('Upload failed: ' + String(err.message || err))
    }
    setLoading(false)
  }

  async function handleDeleteGallery(path: string, id?: string) {
    if (!userId) return
    setLoading(true); setMessage(null)
    try {
      await removeFile(path)
      if (id) {
        const { error } = await supabase.from('seller_portfolio_media').delete().eq('id', id).eq('seller_id', userId)
        if (error) console.warn('could not delete gallery row', error)
      }
      setGallery((g) => g.filter((m) => m.path !== path))
      setMessage('Deleted')
    } catch (err: any) {
      console.warn('delete error', err)
      setMessage('Delete failed: ' + String(err.message || err))
    }
    setLoading(false)
  }

  function renderSrc(path: string | null) {
    if (!path) return null
    try {
      return publicUrlFor(path)
    } catch (e) {
      return null
    }
  }

  return (
  <div className="p-4 scalehub-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Media Gallery</div>
          <div className="text-sm text-gray-400">Add profile, cover, and gallery photos</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-400">Profile Photo</div>
          <div className="mt-2">
            {profilePath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getSafeImageSrc(profilePath ?? undefined)} alt="profile" className="w-28 h-28 rounded-full object-cover" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center text-gray-500">No photo</div>
            )}
          </div>
          <div className="mt-2">
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'profile') }} />
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-400">Cover Photo</div>
          <div className="mt-2">
            {coverPath ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getSafeImageSrc(coverPath ?? undefined)} alt="cover" className="w-full h-36 object-cover rounded-2xl" />
            ) : (
              <div className="w-full h-36 rounded-2xl bg-slate-800 flex items-center justify-center text-gray-500">No cover</div>
            )}
          </div>
          <div className="mt-2">
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'cover') }} />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs text-gray-400">Gallery</div>
        <div className="mt-2 flex gap-2">
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, 'gallery') }} />
        </div>

        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
            {gallery.length === 0 && <div className="text-sm text-gray-400 col-span-3">No gallery images yet.</div>}
          {gallery.map((m: any) => (
            <div key={m.id || m.path} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getSafeImageSrc(m.path)} alt={m.caption || 'gallery'} className="w-full h-24 object-cover rounded-md" />
              <button onClick={() => handleDeleteGallery(m.path, m.id)} className="absolute top-1 right-1 bg-white/10 px-2 py-1 rounded text-xs">Delete</button>
            </div>
          ))}
        </div>
      </div>

      {loading && <div className="mt-3 text-sm text-gray-400">Processing...</div>}
      {message && <div className="mt-3 text-sm text-green-400">{message}</div>}
    </div>
  )
}
