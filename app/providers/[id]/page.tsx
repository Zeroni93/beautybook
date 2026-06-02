import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { mockProviders } from '@/data/providers'
import { getSafeImageSrc } from '@/lib/image'
import { getAverageRating, getReviewCount, formatRating } from '@/lib/reviews'
import ReviewForm from '@/components/ReviewForm'
import BookingModal from '@/components/BookingModal'

type Provider = any

async function fetchProfileAndServices(id: string) {
  // Keep Supabase queries server-side and unchanged in logic.
  try {
    const { data: profiles, error: pErr } = await supabase.from('seller_profiles').select('*').eq('user_id', id).limit(1)
    if (pErr) console.warn('profile fetch error', pErr)
    const profile = (profiles && profiles[0]) || null

    if (!profile) return { profile: null, services: [], gallery: [], reviews: [] }

    const { data: services, error: sErr } = await supabase.from('services').select('*').eq('seller_id', id).eq('is_active', true)
    if (sErr) console.warn('services fetch error', sErr)

    const { data: gallery, error: gErr } = await supabase.from('seller_portfolio_media').select('*').eq('seller_id', id).order('created_at', { ascending: false })
    if (gErr) console.warn('gallery fetch error', gErr)

    const { data: reviews, error: rErr } = await supabase.from('provider_reviews').select('*').eq('provider_id', id).order('created_at', { ascending: false })
    if (rErr) console.warn('reviews fetch error', rErr)

    return {
      profile,
      services: services || [],
      gallery: gallery || [],
      reviews: reviews || [],
    }
  } catch (e) {
    console.warn('Fetch error', e)
    return { profile: null, services: [], gallery: [], reviews: [] }
  }
}

function Stars({ value }: { value: number }) {
  const full = Math.round(value)
  return (
    <div className="flex items-center space-x-1">
      <div className="text-yellow-400">{Array.from({ length: full }).map((_, i) => <span key={i}>★</span>)}</div>
    </div>
  )
}

function getPlaceholderCover(category?: string) {
  const c = (category || '').toLowerCase()
  if (c.includes('barber') || c.includes('hair')) return 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3d9f2f6a1f2e1c7f5a2d6a8f9b0c1d2e'
  if (c.includes('tattoo')) return 'https://images.unsplash.com/photo-1549887534-9f1f6b7f3b36?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=4b8f5f1a9f4b2c3d6e7f8a9b0c1d2e3f'
  if (c.includes('massage') || c.includes('spa')) return 'https://images.unsplash.com/photo-1506719040630-7f5d1d3b3d7f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=6d7c8b9a0e1f2a3b4c5d6e7f8a9b0c1d'
  if (c.includes('photo') || c.includes('photographer')) return 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d'
  if (c.includes('restaurant') || c.includes('food')) return 'https://images.unsplash.com/photo-1541544182025-0b0b6a6d3c3b?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c'
  // default
  return 'https://images.unsplash.com/photo-1523264766116-8d95b5b2a0f8?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=9f8e7d6c5b4a3c2d1e0f9a8b7c6d5e4f'
}

function getPlaceholderAvatar(category?: string) {
  const c = (category || '').toLowerCase()
  if (c.includes('barber') || c.includes('hair')) return 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6'
  if (c.includes('tattoo')) return 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6'
  if (c.includes('massage') || c.includes('spa')) return 'https://images.unsplash.com/photo-1545996124-1a6a9d6b4f2a?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6'
  if (c.includes('photo') || c.includes('photographer')) return 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7'
  if (c.includes('restaurant') || c.includes('food')) return 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7'
  return 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6'
}

export default async function ProviderPage({ params }: { params: { id: string } }) {
  const id = params.id
  const { profile, services, gallery, reviews } = await fetchProfileAndServices(id)

  const provider: Provider | null = profile || mockProviders.find((p: any) => p.id === id) || null
  if (!provider) return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h2 className="text-lg font-semibold">Provider not found</h2>
      <div className="mt-4"><Link href="/browse-pros" className="text-blue-400 underline">Back to providers</Link></div>
    </div>
  )

  // Image helpers and stats
  const cover = getSafeImageSrc(provider?.cover_photo_path || provider?.cover_image || null)
  const avatar = getSafeImageSrc(provider?.profile_photo_path || provider?.avatar_url || provider?.avatar || null)
  const avgRating = getAverageRating(reviews)
  const reviewCount = getReviewCount(reviews)

  // Similar providers: simple mock reuse - pick 3 different providers
  const similar = mockProviders.filter((p: any) => p.id !== provider.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* HERO: premium profile header */}
        <div className="relative rounded-2xl overflow-hidden mb-6">
          {/* Background image or gradient fallback */}
          <div className="absolute inset-0 z-0">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt={`${provider?.business_name ?? 'Provider'} cover`} className="w-full h-[180px] object-cover" />
            ) : (
              // category-based placeholder cover (keeps pages feeling unique)
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getPlaceholderCover(provider?.category)} alt="cover placeholder" className="w-full h-[180px] object-cover" />
            )}
          </div>

          {/* Dark blue gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#002147]/60 via-[#001836]/40 to-black/30 z-10" />

          {/* Hero content */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[180px] flex items-end">
            <div className="w-full flex items-end">
              <div className="flex items-end gap-6">
                <div className="-mt-8 lg:-mt-10">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 border-white/16 bg-white/5 backdrop-blur-md shadow-2xl">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatar} alt={`${provider?.business_name ?? 'Provider'} avatar`} className="w-full h-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getPlaceholderAvatar(provider?.category)} alt="avatar placeholder" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>

                <div className="text-white -mb-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight drop-shadow">{provider?.business_name}</h1>
                  <div className="mt-1 text-sm text-gray-300 flex items-center gap-3">
                    <div>{provider?.category || provider?.specialty}</div>
                    <div className="opacity-60">•</div>
                    <div>{provider?.city}{provider?.state ? `, ${provider?.state}` : ''}</div>
                  </div>

                  {/* Trust badges */}
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-white/6 rounded-md text-xs font-medium text-white soft-border">✔ Verified Provider</div>
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-white/6 rounded-md text-xs font-medium text-white soft-border">⚡ Fast Response</div>
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-white/6 rounded-md text-xs font-medium text-white soft-border">⭐ Top Rated</div>
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-white/6 rounded-md text-xs font-medium text-white soft-border">🔒 Secure Booking</div>
                  </div>

                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-yellow-400 text-lg"><Stars value={avgRating} /></div>
                      <div className="text-sm font-medium">{formatRating(avgRating)}</div>
                      <div className="text-sm text-gray-300">· {reviewCount} reviews</div>
                    </div>

                    {provider?.is_verified && (
                      <div className="inline-flex items-center gap-2 px-2 py-1 bg-white/6 rounded-md text-xs font-medium text-white border border-white/6">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white"><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span>Verified Provider</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Large stats strip removed; metrics are shown inside Provider Stats card below */}

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: main content */}
          <main className="lg:col-span-2 space-y-6">
            {/* About & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white/3 backdrop-blur-sm soft-border hover-border-brand card-blend transition-shadow">
                <h3 className="text-lg font-semibold text-white">About This Provider</h3>
                <ul className="mt-3 text-sm text-gray-300 space-y-2 list-none">
                  <li className="flex items-center gap-2"> <span className="text-green-400">✓</span> Professional Provider</li>
                  <li className="flex items-center gap-2"> <span className="text-green-400">✓</span> Serving Las Vegas Area</li>
                  <li className="flex items-center gap-2"> <span className="text-green-400">✓</span> Available This Week</li>
                  <li className="flex items-center gap-2"> <span className="text-green-400">✓</span> Fast Response Time</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white/3 backdrop-blur-sm soft-border hover-border-brand card-blend transition-shadow">
                <h3 className="text-lg font-semibold text-white">Provider Stats</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-300">
                  <div className="p-3 bg-black/20 rounded">
                    <div className="text-xs">Avg rating</div>
                    <div className="font-semibold text-white">{formatRating(avgRating)}</div>
                  </div>
                  <div className="p-3 bg-black/20 rounded">
                    <div className="text-xs">Reviews</div>
                    <div className="font-semibold text-white">{reviewCount}</div>
                  </div>
                  <div className="p-3 bg-black/20 rounded">
                    <div className="text-xs">Services</div>
                    <div className="font-semibold text-white">{services.length}</div>
                  </div>
                  <div className="p-3 bg-black/20 rounded">
                    <div className="text-xs">Verified</div>
                    <div className="font-semibold text-white">{provider?.is_verified ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Services grid */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Services</h2>
                {services.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-white/3 soft-border hover-border-brand card-blend text-sm text-gray-300 flex items-center gap-3">
                    <div className="text-2xl">📌</div>
                    <div>
                      <div className="font-medium">This provider is updating their services.</div>
                      <div className="text-sm text-gray-400">Send a booking request or message the provider to inquire about availability and pricing.</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((s: any) => (
                      <div key={s.id} className="p-4 lg:p-6 rounded-2xl bg-gradient-to-r from-black/30 to-slate-900/30 soft-border hover-border-brand transform transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-xl card-blend">
                        <div className="flex flex-col gap-3">
                          <div className="font-semibold text-white text-lg">{s.title || s.name}</div>
                          <div className="text-sm text-gray-400">{s.duration || s.duration_text || '30 minutes'}</div>
                          <div className="mt-2 font-bold text-white">{s.price ? `$${s.price}` : s.starting_price ? `From $${s.starting_price}` : (s.price_text ? s.price_text : 'Starting price: Contact provider')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </section>

            {/* Portfolio masonry */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Portfolio Gallery</h2>
                {gallery.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white/3 soft-border hover-border-brand card-blend text-sm text-gray-300 flex items-center gap-3">
                    <div className="text-3xl">📸</div>
                    <div>
                      <div className="font-medium">Portfolio coming soon</div>
                      <div className="text-sm text-gray-400">This provider hasn't uploaded photos yet. Check back soon or message them for examples.</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gallery.map((g: any) => (
                      <div key={g.id} className="rounded overflow-hidden shadow-md hover:scale-105 transform transition-all duration-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getSafeImageSrc(g.path || g.url)} alt={g.caption || 'portfolio'} className="w-full h-48 object-cover rounded" />
                      </div>
                    ))}
                  </div>
                )}
            </section>

              {/* Reviews */}
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Reviews</h2>
                  <div className="text-sm text-gray-300">{formatRating(avgRating)} · {reviewCount} reviews</div>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="p-4 rounded-2xl bg-white/3 soft-border hover-border-brand card-blend">
                    <h3 className="text-lg font-semibold text-white">Review Summary</h3>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="text-2xl font-bold text-yellow-400">{formatRating(avgRating)}</div>
                      <div className="text-sm text-gray-300">{reviewCount} Reviews</div>
                    </div>
                  </div>

                  <ReviewForm providerId={id} />

                  {reviews.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-white/3 soft-border hover-border-brand card-blend text-sm text-gray-300">Be the first to leave a review for this provider.</div>
                  ) : (
                    reviews.slice(0,6).map((r: any) => (
                      <div key={r.id} className="p-4 rounded-2xl bg-gray-900 soft-border hover-border-brand card-blend hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">{(r.author_name||'A').slice(0,1)}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-white">{r.author_name ?? r.customer_name ?? 'Anonymous'}</div>
                              <div className="text-xs text-gray-400">{new Date(r.created_at || r.createdAt || Date.now()).toLocaleDateString()}</div>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">{r.comment ?? r.review_text}</div>
                            <div className="mt-2 text-yellow-400">{formatRating(r.rating)}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

            {/* Similar providers */}
            <section>
              <h2 className="text-xl font-semibold text-white">You may also like</h2>
                <div className="mt-4">
                  <div className="hidden sm:grid sm:grid-cols-3 gap-4">
                    {similar.map((s: any) => (
                      <Link key={s.id} href={`/providers/${s.id}`} className="p-4 rounded-2xl bg-white/3 soft-border hover-border-brand transform transition-all duration-200 hover:-translate-y-2 hover:shadow-lg card-blend">
                        <div className="flex items-start gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={getPlaceholderAvatar(s.category)} alt={s.business_name} className="w-14 h-14 rounded object-cover" />
                          <div className="flex-1">
                            <div className="text-white font-semibold">{s.business_name || s.name}</div>
                            <div className="text-sm text-gray-400">{s.category} · {s.city ?? s.location ?? 'Unknown'}</div>
                            <div className="mt-2 text-sm text-yellow-400">{s.rating ? `⭐ ${formatRating(s.rating)}` : '⭐ 4.5'}</div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm text-gray-300">Starting at</div>
                          <div className="text-sm font-semibold text-white">${s.starting_price ?? s.price ?? 25}</div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* mobile horizontal scroll */}
                  <div className="sm:hidden mt-2 flex gap-3 overflow-x-auto py-2">
                    {similar.map((s:any)=> (
                      <Link key={s.id} href={`/providers/${s.id}`} className="min-w-[220px] p-3 rounded-2xl bg-white/3 soft-border hover-border-brand transform transition-all duration-200 hover:-translate-y-1 hover:shadow-md card-blend">
                        <img src={getPlaceholderAvatar(s.category)} alt={s.business_name} className="w-full h-32 object-cover rounded" />
                        <div className="mt-2 text-white font-semibold">{s.business_name}</div>
                        <div className="text-sm text-gray-400">{s.category} · {s.city ?? '—'}</div>
                        <div className="mt-1 text-sm text-gray-300">${s.starting_price ?? s.price ?? 25} · {s.rating ? `⭐ ${formatRating(s.rating)}` : '⭐ 4.5'}</div>
                      </Link>
                    ))}
                  </div>
                </div>
            </section>
          </main>

          {/* Right: sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-[100px] space-y-6">
              {/* Booking (redesigned) */}
              <div className="p-6 rounded-2xl booking-card">
                <div className="text-sm opacity-90">Book Appointment</div>
                <div className="mt-3 text-lg font-semibold">{provider?.business_name}</div>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs text-white/80">Select Service</label>
                    <div className="mt-2">
                      <select className="w-full rounded p-2 bg-white/10 text-white border input-field">
                        {services.length === 0 ? <option>No services</option> : services.map((s:any)=> (<option key={s.id} value={s.id}>{s.title || s.name}</option>))}
                      </select>
                    </div>
                  </div>

                    <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="w-full rounded p-2 bg-white/10 text-white border input-field" />
                    <input type="time" className="w-full rounded p-2 bg-white/10 text-white border input-field" />
                  </div>

                  <div className="mt-2">
                    <BookingModal sellerId={id} services={services} buttonClassName="px-4 py-2 rounded scalehub-button-primary" />
                  </div>
                  <div className="mt-2 text-xs text-gray-400">Most providers respond within 2 hours — we'll notify you when they reply.</div>
                </div>
              </div>

              {/* Instagram */}
              {provider?.instagram && (
                <div className="p-4 rounded-2xl bg-white/3 soft-border hover-border-brand card-blend">
                  <h4 className="text-sm text-white">Instagram</h4>
                  <div className="mt-2 text-sm text-gray-300">@{provider.instagram}</div>
                  <a target="_blank" rel="noreferrer" href={`https://instagram.com/${provider.instagram}`} className="mt-3 inline-block text-sm text-blue-200 underline">View Profile</a>
                </div>
              )}

              {/* Trust card */}
              <div className="p-4 rounded-2xl bg-white/3 soft-border hover-border-brand card-blend">
                <h4 className="text-sm text-white">Trust</h4>
                <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-300">
                  <div className="inline-flex items-center gap-2">✔ Verified Provider</div>
                  <div className="inline-flex items-center gap-2">⚡ Fast Response</div>
                  <div className="inline-flex items-center gap-2">🔒 Secure Booking</div>
                  <div className="inline-flex items-center gap-2">⭐ Top Rated</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
