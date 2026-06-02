import { publicUrlFor } from './storage'

export function getSafeImageSrc(src?: string | null): string {
  const placeholder = '/images/provider-placeholder.svg'
  if (!src) return placeholder
  const s = String(src)
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  if (s.startsWith('/')) return s

  // If the value contains the bucket prefix, strip it
  if (s.startsWith('provider-media/')) {
    const path = s.replace(/^provider-media\//, '')
    const url = publicUrlFor(path)
    return url ?? placeholder
  }

  // If it looks like a storage path (userId/...), attempt to convert to public URL
  if (/^[\w-]+\/.+/.test(s) || s.includes('/')) {
    const url = publicUrlFor(s)
    return url ?? placeholder
  }

  // Fallback to placeholder
  return placeholder
}
