"use client"
import React, { useMemo, useState } from 'react'
import { Provider } from './ProviderCard'
import ProviderCard from './ProviderCard'

type Props = { providers: Provider[] }

const CATEGORIES = [
  'All',
  'Barber',
  'Tattoo Artist',
  'Massage Therapist',
  'Photographer',
  'Mover',
  'Restaurant',
  'Personal Trainer',
  'Dog Groomer'
]

export default function ProvidersGridClient({ providers }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      if (category !== 'All' && p.category !== category) return false
      if (!query) return true
      const q = query.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        (p.short_description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      )
    })
  }, [providers, query, category])

  const featured = useMemo(() => providers.slice(0, 6), [providers])

  return (
    <div>
  <div className="mb-6 scalehub-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search providers, services, or location"
              className="input-field w-full"
            />
          </div>

          <div className="hidden sm:flex gap-2">
            <div className="text-sm text-gray-400">Showing</div>
            <div className="font-semibold">{filtered.length}</div>
            <div className="text-sm text-gray-400">providers</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-sm ${category === c ? 'bg-[var(--brand-primary)] text-white' : 'bg-slate-900/60 text-gray-300'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <section className="mb-8">
        <h3 className="text-xl font-semibold">Featured Providers</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((p, i) => (
            <div key={p.id} className={`scalehub-fade-up scalehub-delay-${((i % 5) + 1) * 100}`}>
              <ProviderCard provider={p} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <div key={p.id} className={`scalehub-fade-up scalehub-delay-${((i % 5) + 1) * 100}`}>
              <ProviderCard provider={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
