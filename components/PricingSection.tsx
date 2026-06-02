import PricingCard from './PricingCard'

export default function PricingSection() {
  const features = [
    'Provider profile',
    'Service menu',
    'Availability control',
    'Booking requests',
    'Photo/video gallery',
    'Reviews & ratings',
    'Manual or automatic confirmation'
  ]

  return (
    <section className="mt-10">
      <div className="max-w-md mx-auto p-4 scalehub-card text-center">
        <div className="text-lg font-semibold">$15/month for providers</div>
        <div className="mt-2 text-sm text-gray-300">No commissions. No booking fees. Keep 100% of your earnings.</div>
        <div className="mt-4">
          <a href="/join" className="scalehub-button-primary">Become a Provider</a>
        </div>
      </div>
    </section>
  )
}
