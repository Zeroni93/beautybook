import { ProviderCard } from '@/components/ProviderCard'
import { mockProviders } from '@/data/providers'
import { supabase } from '@/lib/supabaseClient'

async function fetchProviders() {
  try {
    const { data, error } = await supabase
      .from('seller_profiles')
      .select('*')
      .eq('accepts_new_appointments', true)
      .limit(50)

    if (error) {
      console.warn('Supabase fetch error', error)
      return mockProviders
    }

    if (!data || data.length === 0) return mockProviders

    // Map to provider shape used by ProviderCard
    return data.map((s: any) => ({
      id: s.user_id,
      name: s.business_name || s.full_name || 'Unknown',
      category: s.specialty || 'Service',
      location: `${s.city || ''}${s.city && s.state ? ', ' : ''}${s.state || ''}` || 'Las Vegas, NV',
      bio: s.bio || '',
      instagram: s.instagram_handle || '',
      image: s.profile_photo_path || null,
      startingPrice: '$25+',
      rating: 4.8
    }))
  } catch (e) {
    console.warn('Fetch failed', e)
    return mockProviders
  }
}

export default async function BrowsePros() {
  const providers = await fetchProviders()

  return (
    <div className="px-5 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Browse Pros</h1>
      <p className="text-sm text-gray-300 mt-1">Hand-picked barbers and nail techs in Las Vegas.</p>

      <div className="mt-6 grid gap-3">
        {providers.map((p: any) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>
    </div>
  )
}
