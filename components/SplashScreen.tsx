"use client"
import { useEffect, useState } from 'react'
import clsx from 'clsx'

export default function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('scalehub_splash_seen')
      if (seen) {
        setMounted(false)
        return
      }

      // show splash, then hide after delay
      setVisible(true)
      const showDuration = 2000 // ms
      const timeout = setTimeout(() => {
        setVisible(false)
        sessionStorage.setItem('scalehub_splash_seen', '1')
        // allow fade-out animation to complete before unmounting
        setTimeout(() => setMounted(false), 500)
      }, showDuration)

      return () => clearTimeout(timeout)
    } catch (e) {
      setMounted(false)
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black to-scalenav',
        'backdrop-blur-sm'
      )}
      aria-hidden
    >
      <div className={clsx('text-center transform transition-all', visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95', 'motion-safe:duration-500') }>
        <div className="mx-auto w-36 h-36 mb-4">
          {/* use existing logo in public */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={'/logo.png'} alt="ScaleHub" className="w-full h-full object-contain" />
        </div>
        <div className="text-2xl font-bold text-white">ScaleHub</div>
        <div className="mt-2 text-sm text-gray-300">Book local services in minutes</div>
  <div className={clsx('mt-6 w-48 h-2 mx-auto rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)]', visible ? 'opacity-90 animate-glow' : 'opacity-0')}></div>
      </div>
    </div>
  )
}
