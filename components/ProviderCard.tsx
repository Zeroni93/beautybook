import Link from 'next/link'

export type Provider = {
  id: string
  name: string
  category: string
  location?: string
  startingPrice?: string
  rating?: number | null
}

export function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <div className="bg-gray-900 p-4 rounded-md border border-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">{provider.name}</div>
          <div className="text-xs text-gray-400">{provider.category} • {provider.location ?? 'Las Vegas, NV'}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold">{provider.startingPrice}</div>
          <div className="text-xs text-gray-500">★ {provider.rating ?? '—'}</div>
        </div>
      </div>

      <div className="mt-3 flex gap-3">
        <Link href={`/providers/${provider.id}`} className="ml-auto text-sm text-softpink">View Profile</Link>
      </div>
    </div>
  )
}

export default ProviderCard
