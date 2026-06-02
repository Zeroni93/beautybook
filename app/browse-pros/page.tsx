import { mockProviders } from '@/data/providers'
import { supabase } from '@/lib/supabaseClient'
import ProvidersGridClient from '@/components/ProvidersGridClient'

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

    // Map to provider shape used by ProviderCard and grid
    return data.map((s: any) => ({
      id: s.user_id,
      name: s.business_name || s.full_name || 'Unknown',
      category: s.specialty || 'Service',
      location: `${s.city || ''}${s.city && s.state ? ', ' : ''}${s.state || ''}` || 'Las Vegas, NV',
      short_description: s.bio || '',
      instagram: s.instagram_handle || '',
      image: s.profile_photo_path || null,
      startingPrice: s.starting_price ? `$${s.starting_price}` : '$25+',
      startingPriceRaw: s.starting_price || null,
      startingPriceLabel: s.starting_price ? `$${s.starting_price}` : '$25+',
      startingPriceDisplay: s.starting_price ? `$${s.starting_price}` : '$25+',
      startingPriceFormatted: s.starting_price ? `$${s.starting_price}` : '$25+',
      startingPriceText: s.starting_price ? `$${s.starting_price}` : '$25+',
      startingPriceValue: s.starting_price || null,
      rating: s.rating || 4.8,
      review_count: s.review_count || Math.floor(Math.random() * 100) + 10
    }))
  } catch (e) {
    console.warn('Fetch failed', e)
    return mockProviders
  }
}

export default async function BrowsePros() {
  const providers = await fetchProviders()

  // ensure providers fallback to mock data shape
  const normalized = (providers || mockProviders).map((p: any) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    location: p.location || 'Las Vegas, NV',
    startingPrice: p.startingPrice || p.startingPriceLabel || '$25+',
    rating: p.rating || 4.8,
    review_count: p.review_count || 20,
    short_description: p.short_description || p.bio || '',
    image: p.image || null
  }))

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold scalehub-fade-up">Browse Local Service Providers</h1>
      <p className="text-sm text-gray-300 mt-1 scalehub-fade-in">Hand-picked local providers in Las Vegas across a variety of services.</p>

      <div className="mt-6 scalehub-fade-up">
        {/* Client component handles search, filters, featured, and grid */}
        <ProvidersGridClient providers={normalized as any} />
      </div>
    </div>
  )
}
