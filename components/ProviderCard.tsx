import Link from 'next/link'
import { getSafeImageSrc } from '@/lib/image'

export type Provider = {
  id: string
  name: string
  category: string
  location?: string
  startingPrice?: string
  rating?: number | null
  review_count?: number
  short_description?: string
  image?: string | null
}

export function ProviderCard({ provider }: { provider: Provider }) {
  return (
  <div className="scalehub-glow-card overflow-hidden anim-smooth transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-[0_12px_40px_rgba(37,99,235,0.20)] hover:border-[rgba(37,99,235,0.18)]">
      <div className="w-full h-40 bg-gradient-to-br from-gray-800 to-black flex items-end p-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-gray-700 flex items-center justify-center text-gray-400">{provider.image ? <img src={getSafeImageSrc(provider.image ?? undefined)} alt={provider.name} className="w-full h-full object-cover rounded-md" /> : '👤'}</div>
          <div>
            <div className="text-sm font-semibold text-white">{provider.name}</div>
            <div className="text-xs text-gray-400">{provider.category}</div>
          </div>
        </div>
          <div className="ml-auto">
          <div className="inline-block text-xs px-2 py-1 rounded-md bg-slate-800 text-gray-200 font-semibold">{provider.startingPrice}</div>
        </div>
      </div>

  <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="inline-block text-xs px-2 py-1 rounded-md bg-slate-800 text-gray-200 font-semibold">{provider.category}</div>
              <div className="inline-block text-xs px-2 py-1 rounded bg-gray-800 text-cyan-300 font-semibold">Verified Provider</div>
            </div>
            <div className="mt-2 text-lg font-semibold text-white">{provider.name}</div>
            <div className="text-sm text-gray-400">{provider.location ?? 'Las Vegas, NV'}</div>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold">{provider.startingPrice}</div>
            <div className="text-xs text-gray-400">★ {provider.rating ?? '—'} • {provider.review_count ?? 0}</div>
          </div>
        </div>

        {provider.short_description && (
          <div className="mt-3 text-sm text-gray-300">{provider.short_description}</div>
        )}

          <div className="mt-4 flex items-center justify-between">
          <Link href={`/providers/${provider.id}`} className="text-sm scalehub-button-secondary">View Profile</Link>
          <div className="text-xs text-gray-400">Reviews coming soon • Featured placement based on ratings</div>
        </div>
      </div>
    </div>
  )
}

export default ProviderCard
