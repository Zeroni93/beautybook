import PricingSection from '@/components/PricingSection'

export const metadata = { title: 'Why Providers Choose ScaleHub' }

export default function PricingPage() {
  return (
    <main className="px-5 pt-8 pb-24 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Why Providers Choose ScaleHub</h1>
      <p className="mt-2 text-sm text-gray-300">ScaleHub is built for local service providers. Our simple, provider-first approach keeps billing predictable so you can focus on your clients.</p>

      <section className="mt-6 p-4 rounded-2xl border border-gray-800 bg-gray-900">
          <h2 className="text-lg font-semibold">Simple provider plan</h2>
        <ul className="mt-3 text-sm text-gray-300 space-y-2">
          <li>• $15/month flat provider plan</li>
          <li>• No commissions</li>
          <li>• No booking fees</li>
          <li>• Customers book for free</li>
          <li>• Providers keep 100% of what they earn</li>
          <li>• Public booking profile and QR code</li>
          <li>• Manual or automatic confirmations</li>
        </ul>

        <div className="mt-6">
            <a href="/join" className="px-4 py-2 rounded bg-softpink text-black">Become a Provider</a>
        </div>
      </section>
    </main>
  )
}
