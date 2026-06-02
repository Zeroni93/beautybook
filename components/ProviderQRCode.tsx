"use client"
import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

type Props = { providerId: string }

export default function ProviderQRCode({ providerId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  // prefer build-time env var, but fallback to client origin when available
  const site = (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')) || undefined
  const clientOrigin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : undefined
  const profileUrl = `${(site || clientOrigin || 'http://localhost:3000').replace(/\/$/, '')}/providers/${providerId}`

  function copyLink() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl)
    }
  }

  function downloadQRCode() {
    try {
      const canvas = canvasRef.current
      if (!canvas) return
      // qrcode.react renders a canvas; ensure we can read it
      const url = (canvas as HTMLCanvasElement).toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `provider-${providerId}-qrcode.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (e) {
      console.warn('Could not download QR code', e)
    }
  }

  return (
  <div className="p-4 rounded-2xl border border-gray-800 scalehub-card max-w-sm">
      <div className="text-sm font-semibold text-white mb-2">Your Public Booking Link & QR</div>
      <div className="text-sm text-gray-400 mb-4">Print this QR code or share it online so customers can scan and book directly.</div>

      <div className="flex flex-col items-center">
        <QRCodeCanvas
          id={`qrcode-${providerId}`}
          value={profileUrl}
          size={180}
          bgColor="#0b0b0b"
          fgColor="#ffffff"
          includeMargin={true}
          ref={canvasRef as any}
        />

        <a className="mt-3 text-xs text-softpink break-words" href={profileUrl}>{profileUrl}</a>

        <div className="mt-4 flex gap-2">
          <button onClick={copyLink} className="px-3 py-1 rounded scalehub-button-primary text-sm">Copy Booking Link</button>
          <button onClick={downloadQRCode} className="px-3 py-1 rounded btn-secondary text-sm">Download QR</button>
          <button onClick={() => window.print()} className="px-3 py-1 rounded scalehub-button-secondary text-sm">Print QR</button>
        </div>
      </div>
    </div>
  )
}
