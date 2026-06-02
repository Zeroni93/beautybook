"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any | null>(null)

  // subscribe to auth changes
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const { data } = await (await import('@/lib/supabaseClient')).supabase.auth.getSession()
        if (!mounted) return
        setUser(data.session?.user ?? null)
      } catch (e) {
        console.warn(e)
      }
    }
    load()

    let sub: any = null
    ;(async () => {
      const { supabase } = await import('@/lib/supabaseClient')
      sub = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setUser(session?.user ?? null)
      })
    })()

    return () => {
      mounted = false
      sub?.data?.subscription?.unsubscribe?.()
    }
  }, [])

  async function handleSignOut() {
    const { supabase } = await import('@/lib/supabaseClient')
    await supabase.auth.signOut()
    setUser(null)
    // navigate home
    window.location.href = '/'
  }
  return (
    <header className="sticky top-0 z-40 bg-scalenav/80 backdrop-blur-sm border-b border-white/6">
      <div className="w-full">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="ScaleHub" width={48} height={48} priority />
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-white">ScaleHub</div>
              <div className="text-xs text-gray-400">Book local services near you.</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-200 hover:text-[var(--brand-primary)] transition-colors">Home</Link>
            <Link href="/browse-pros" className="text-sm text-gray-200 hover:text-[var(--brand-primary)] transition-colors">Browse Providers</Link>
            <Link href="/join" className="text-sm text-gray-200 hover:text-[var(--brand-primary)] transition-colors">Join as Provider</Link>
            <Link href="/starter" className="ml-2 px-3 py-1 rounded text-black text-sm btn-primary hover:scale-105 transition-transform">Get Started</Link>
            {user ? (
              <button onClick={handleSignOut} className="text-sm text-gray-200 hover:text-[var(--brand-primary)] transition-colors">Logout</button>
            ) : (
              <Link href="/auth/login" className="text-sm text-gray-200 hover:text-[var(--brand-primary)] transition-colors">Login</Link>
            )}
          </nav>

          <div className="md:hidden">
            <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="p-2 rounded-md bg-scalecard text-gray-200 hover:bg-slate-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden mt-2 pb-4">
            <div className="flex flex-col gap-2 bg-scalenav/90 p-3 rounded-lg">
              <Link href="/" className="px-3 py-2 rounded text-gray-200 hover:bg-slate-800 hover:text-[var(--brand-primary)]">Home</Link>
              <Link href="/browse-pros" className="px-3 py-2 rounded text-gray-200 hover:bg-slate-800 hover:text-[var(--brand-primary)]">Browse Providers</Link>
              <Link href="/join" className="px-3 py-2 rounded text-gray-200 hover:bg-slate-800 hover:text-[var(--brand-primary)]">Join as Provider</Link>
              <Link href="/starter" className="px-3 py-2 rounded text-black text-sm btn-primary">Get Started</Link>
              {user ? (
                <button onClick={handleSignOut} className="px-3 py-2 rounded text-gray-200 hover:bg-slate-800 hover:text-[var(--brand-primary)]">Logout</button>
              ) : (
                <Link href="/auth/login" className="px-3 py-2 rounded text-gray-200 hover:bg-slate-800 hover:text-[var(--brand-primary)]">Login</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
