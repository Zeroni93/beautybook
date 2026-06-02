import Link from 'next/link'

export default function PricingCard({ title, price, features, popular }: { title: string, price: string, features: string[], popular?: boolean }) {
  return (
  <div className={`scale-card p-6 rounded-2xl card-hover ${popular ? 'ring-2 ring-[rgba(37,99,235,0.12)]' : ''}`}>
  {popular && <div className="text-sm text-[var(--brand-primary)] font-semibold mb-2">Most Popular</div>}
      <div className="flex items-baseline gap-3">
        <div className="text-2xl font-bold">{title}</div>
        <div className="text-sm text-gray-400">{price}/mo</div>
      </div>
      <ul className="mt-4 text-sm space-y-2 text-gray-300">
        {features.map((f) => <li key={f}>• {f}</li>)}
      </ul>
      <div className="mt-6">
        <Link href="/auth/signup?role=seller">
          <button className={`w-full btn-primary`}>Join as Provider</button>
        </Link>
      </div>
    </div>
  )
}
