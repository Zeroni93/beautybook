import Link from 'next/link'
import { Button } from '@/components/Button'
import { ProviderCard } from '@/components/ProviderCard'
import { mockProviders } from '@/data/providers'
import CarouselSection from '@/components/CarouselSection'

export default function Home() {
  const featured = mockProviders.slice(0, 3)

  return (
    <div className="px-5 pt-8 pb-24 max-w-3xl mx-auto">
      <section className="text-center mt-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Book Las Vegas Barbers & Nail Techs</h1>
        <p className="mt-3 text-sm text-gray-200">Find local beauty pros, view services, and request appointments in minutes.</p>

        <div className="mt-6 flex justify-center gap-3">
          <Link href="/browse-pros">
            <Button variant="primary">Browse Pros</Button>
          </Link>
          <Link href="/join">
            <Button variant="ghost">Join BeautyBook</Button>
          </Link>
        </div>
      </section>

      <CarouselSection title="Featured Las Vegas Pros" subtitle="Top picks from our local pros" seeAll={<Link href="/browse-pros" className="hidden sm:inline"><Button variant="ghost">See all</Button></Link>}>
        {featured.map((p) => (
          <div key={p.id} className="snap-start carousel-card flex-shrink-0">
            <ProviderCard provider={p} />
          </div>
        ))}
      </CarouselSection>

      <CarouselSection title="How it works" subtitle="Quick steps to book a pro in Las Vegas.">
        <div className="snap-start carousel-card flex-shrink-0 p-4 rounded-lg border border-gray-800 bg-gray-900 text-center">
          <div className="text-3xl">🔎</div>
          <div className="mt-2 font-medium">Find a Pro</div>
          <div className="mt-1 text-sm text-gray-400">Search top barbers & nail techs in Las Vegas.</div>
        </div>

        <div className="snap-start carousel-card flex-shrink-0 p-4 rounded-lg border border-gray-800 bg-gray-900 text-center">
          <div className="text-3xl">💅</div>
          <div className="mt-2 font-medium">Choose a Service</div>
          <div className="mt-1 text-sm text-gray-400">View services and starting prices.</div>
        </div>

        <div className="snap-start carousel-card flex-shrink-0 p-4 rounded-lg border border-gray-800 bg-gray-900 text-center">
          <div className="text-3xl">📅</div>
          <div className="mt-2 font-medium">Request an Appointment</div>
          <div className="mt-1 text-sm text-gray-400">Pick a date/time and send a request.</div>
        </div>
      </CarouselSection>

      <CarouselSection title="Why BeautyBook" subtitle="Why local pros choose us">
        <div className="snap-start carousel-card flex-shrink-0 p-4 rounded-lg border border-gray-800 bg-gray-900 text-center">
          <div className="font-semibold">Las Vegas-first</div>
          <div className="mt-1 text-sm text-gray-400">Designed specifically for the Las Vegas market.</div>
        </div>

        <div className="snap-start carousel-card flex-shrink-0 p-4 rounded-lg border border-gray-800 bg-gray-900 text-center">
          <div className="font-semibold">Mobile-friendly booking</div>
          <div className="mt-1 text-sm text-gray-400">Book on the go with a sleek mobile-first experience.</div>
        </div>

        <div className="snap-start carousel-card flex-shrink-0 p-4 rounded-lg border border-gray-800 bg-gray-900 text-center">
          <div className="font-semibold">Built for pros</div>
          <div className="mt-1 text-sm text-gray-400">Made for barbers and nail techs to get discovered.</div>
        </div>
      </CarouselSection>

      {/* Provider CTA */}
      <section className="mt-10 mb-12 p-4 rounded-lg border border-pink-300 bg-gradient-to-br from-black to-gray-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Are you a barber or nail tech in Las Vegas?</h3>
            <p className="mt-1 text-sm text-gray-300">Create a clean profile, showcase your services, and start accepting booking requests.</p>
          </div>

          <div className="self-start sm:self-auto">
            <Link href="/join">
              <Button variant="primary">Join BeautyBook</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
