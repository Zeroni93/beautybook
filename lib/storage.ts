import { supabase } from './supabaseClient'

export function publicUrlFor(path: string | null | undefined): string | null {
  if (!path) return null
  try {
    const { data } = supabase.storage.from('provider-media').getPublicUrl(path)
    return data.publicUrl || null
  } catch (e) {
    return null
  }
}

export async function uploadFile(userId: string, folder: string, file: File) {
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const path = `${userId}/${folder}/${filename}`
  const { error } = await supabase.storage.from('provider-media').upload(path, file, { upsert: false })
  if (error) throw error
  return path
}

export async function removeFile(path: string) {
  const { error } = await supabase.storage.from('provider-media').remove([path])
  if (error) throw error
  return true
}

export async function createSignedUrl(path: string, expiresIn = 60) {
  // Returns a signed URL for private buckets
  const { data, error } = await supabase.storage.from('provider-media').createSignedUrl(path, expiresIn)
  if (error) throw error
  return data.signedUrl
}
