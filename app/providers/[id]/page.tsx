import { mockProviders } from '@/data/providers'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import BookingForm from '@/components/BookingForm'

// Note: seller_profiles and appointments require authenticated user IDs. Inserting into these tables
// should be done after Supabase Auth is integrated (server-side or via authenticated client).

async function fetchProfileAndServices(id: string) {
  try {
    const { data: profiles, error: pErr } = await supabase
      .from('seller_profiles')
      .select('*')
      .eq('user_id', id)
      .limit(1)

    if (pErr) {
      console.warn('Profile fetch error', pErr)
      return { profile: null, services: [] }
    }

    const profile = profiles && profiles[0]
    if (!profile) return { profile: null, services: [] }

    const { data: services, error: sErr } = await supabase
      .from('services')
      .select('*')
      .eq('seller_id', id)
      .eq('is_active', true)

    if (sErr) console.warn('Services fetch error', sErr)

    return { profile, services: services || [] }
  } catch (e) {
    console.warn('Fetch error', e)
    return { profile: null, services: [] }
  }
}

export default async function ProviderPage({ params }: { params: { id: string } }) {
  const { profile, services } = await fetchProfileAndServices(params.id)

  // Fallback to mock provider if profile not found
  if (!profile) {
    const provider = mockProviders.find((p) => p.id === params.id)
    if (!provider) return <div className="p-5">Provider not found</div>

    return (
      <div className="px-5 py-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-gray-800 rounded-md" />
          <div>
            <h1 className="text-xl font-bold">{provider.name}</h1>
            <div className="text-sm text-gray-400">{provider.category} • Las Vegas, NV</div>
          </div>
        </div>

        <section className="mt-6">
          <h2 className="font-semibold">Services</h2>
          <ul className="mt-2 text-sm text-gray-300 space-y-2">
            <li>Basic Cut — $25</li>
            <li>Premium Cut — $40</li>
            <li>Shave — $15</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold">Instagram</h2>
          <div className="mt-2">
            <Link href="#" className="text-softpink text-sm">@{provider.instagram || 'example'}</Link>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold">Request Booking</h2>
          <BookingForm sellerId={params.id} services={[]} />
        </section>
      </div>
    )
  }

  return (
    <div className="px-5 py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-gray-800 rounded-md" />
        <div>
          <h1 className="text-xl font-bold">{profile.business_name}</h1>
          <div className="text-sm text-gray-400">{profile.specialty} • {profile.city}, {profile.state}</div>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="font-semibold">Services</h2>
        <ul className="mt-2 text-sm text-gray-300 space-y-2">
          {services.length === 0 && <li>$25+ — Default service</li>}
          {services.map((s: any) => (
            <li key={s.id}>
              {s.name} — {s.price} {s.duration ? `• ${s.duration}` : ''} {s.deposit ? `• deposit ${s.deposit}` : ''}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Instagram</h2>
        <div className="mt-2">
          <Link href={`https://instagram.com/${profile.instagram_handle || ''}`} className="text-softpink text-sm">@{profile.instagram_handle || 'example'}</Link>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Request Booking</h2>
        <BookingForm sellerId={params.id} services={services} />
      </section>
    </div>
  )
}
