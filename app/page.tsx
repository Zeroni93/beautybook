import Link from 'next/link'
import { Button } from '@/components/Button'
import { ProviderCard } from '@/components/ProviderCard'
import { mockProviders } from '@/data/providers'
import CarouselSection from '@/components/CarouselSection'
import PricingSection from '@/components/PricingSection'
import LandingHero from '@/components/LandingHero'

export default function Home() {
  const featured = mockProviders.slice(0, 3)

  return (
    <div className="px-5 pt-6 pb-24 max-w-6xl mx-auto">
      <LandingHero />

  <CarouselSection title="Featured Local Providers" subtitle="Top picks from our local providers" seeAll={<Link href="/browse-pros" className="hidden sm:inline"><Button variant="ghost">See all</Button></Link>}>
          {featured.map((p) => (
          <div key={p.id} className="snap-start carousel-card flex-shrink-0 motion-safe-animate scalehub-fade-up">
            <ProviderCard provider={p} />
          </div>
        ))}
      </CarouselSection>

  <CarouselSection title="How it works" subtitle="Quick steps to book a provider in your area.">
  <div className="snap-start carousel-card flex-shrink-0 p-4 rounded-lg border border-gray-800 bg-slate-900/70 text-center">
          <div className="text-3xl">🔎</div>
          <div className="mt-2 font-medium">Find a Pro</div>
          <div className="mt-1 text-sm text-gray-400">Search local service providers in your area.</div>
        </div>

  <div className="snap-start carousel-card flex-shrink-0 p-4 rounded-lg border border-gray-800 bg-slate-900/70 text-center">
          <div className="text-3xl">💅</div>
          <div className="mt-2 font-medium">Choose a Service</div>
          <div className="mt-1 text-sm text-gray-400">View services and starting prices.</div>
        </div>

  <div className="snap-start carousel-card flex-shrink-0 p-4 rounded-lg border border-gray-800 bg-slate-900/70 text-center">
          <div className="text-3xl">📅</div>
          <div className="mt-2 font-medium">Request an Appointment</div>
          <div className="mt-1 text-sm text-gray-400">Pick a date/time and send a request.</div>
        </div>
      </CarouselSection>

  <CarouselSection title="Why ScaleHub" subtitle="Why local providers choose us">
  <div className="snap-start carousel-card flex-shrink-0 p-4 rounded-lg border border-gray-800 bg-slate-900/70 text-center">
          <div className="font-semibold">Las Vegas-first</div>
          <div className="mt-1 text-sm text-gray-400">Designed specifically for the Las Vegas market.</div>
        </div>

  <div className="snap-start carousel-card flex-shrink-0 p-4 rounded-lg border border-gray-800 bg-slate-900/70 text-center">
          <div className="font-semibold">Mobile-friendly booking</div>
          <div className="mt-1 text-sm text-gray-400">Book on the go with a sleek mobile-first experience.</div>
        </div>

  <div className="snap-start carousel-card flex-shrink-0 p-4 rounded-lg border border-gray-800 bg-slate-900/70 text-center">
          <div className="font-semibold">Built for providers</div>
          <div className="mt-1 text-sm text-gray-400">Made for local service providers to get discovered and manage bookings.</div>
        </div>
      </CarouselSection>

  {/* Provider CTA */}
  <section className="mt-8 mb-10 p-4 rounded-lg border border-pink-300 bg-gradient-to-br from-black to-gray-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Are you a service provider?</h3>
            <p className="mt-1 text-sm text-gray-300">Create your profile, list services, manage availability, and receive booking requests.</p>
          </div>

          <div className="self-start sm:self-auto">
            <Link href="/join">
              <Button variant="primary">Join as Provider</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
