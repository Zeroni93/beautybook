import Link from 'next/link'
import { Button } from '@/components/Button'

export default function LandingHero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <div className="hero-glow opacity-60 scalehub-glow-pulse" />
      </div>

      <div className="relative flex flex-col items-center text-center py-6">
        <div className="w-full max-w-xl px-4">
          <h1 className="mx-auto text-white tracking-tight font-extrabold text-4xl md:text-6xl lg:text-7xl leading-tight premium-headline max-w-2xl scalehub-fade-up">
            <div>Book local services</div>
            <div className="mt-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-[rgba(96,165,250,0.6)] scalehub-fade-up scalehub-delay-100">without the back-and-forth.</div>
          </h1>

          <p className="mt-3 text-slate-300 mx-auto max-w-2xl leading-relaxed text-base md:text-lg scalehub-fade-up scalehub-delay-100">ScaleHub helps customers request bookings instantly while providers manage services, availability, and confirmations in one simple dashboard.</p>

          <div className="mt-6 flex gap-4 justify-center scalehub-fade-up scalehub-delay-200">
            <Link href="/browse-pros" className="transform anim-smooth">
              <Button variant="primary" className="px-6 py-3 rounded-xl btn-primary scalehub-fade-up scalehub-delay-200">Start Booking</Button>
            </Link>
            <Link href="/join" className="transform anim-smooth">
              <Button variant="ghost" className="px-6 py-3 rounded-xl border border-gray-800 bg-slate-900/60 text-white scalehub-fade-up scalehub-delay-200">Join as Provider</Button>
            </Link>
          </div>
        </div>

        <div className="mt-10 w-full flex justify-center">
          <div className="relative w-full max-w-5xl">
            <div className="absolute -inset-6 blur-3xl bg-gradient-to-r from-blue-600/20 to-transparent opacity-40 rounded-2xl scalehub-fade-in scalehub-glow-pulse" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Left: Customer booking mock */}
              <div className="md:col-span-1 scalehub-card p-5 scalehub-fade-up scalehub-delay-300 scalehub-float card-hover">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-md" />
                  <div>
                    <div className="text-sm text-gray-400">Provider</div>
                    <div className="text-lg font-semibold">A. Rivera • Hair Design</div>
                    <div className="text-xs text-gray-400">Barber • Las Vegas, NV</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-gray-400">Services</div>
                  <ul className="mt-2 space-y-2 text-sm text-gray-300">
                    <li className="flex justify-between items-center"><span>Basic Cut</span><span className="font-medium">$25</span></li>
                    <li className="flex justify-between items-center"><span>Premium Cut</span><span className="font-medium">$40</span></li>
                    <li className="flex justify-between items-center"><span>Shave</span><span className="font-medium">$15</span></li>
                  </ul>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-gray-400">Availability</div>
                  <div className="mt-2 text-sm text-gray-300">Mon–Fri • 9:00 AM — 5:00 PM</div>
                </div>

                <div className="mt-5">
                  <button className="w-full scalehub-button-primary">Request Appointment</button>
                </div>
              </div>

              {/* Center: Connector (horizontal on md+, vertical on mobile) */}
              <div className="md:col-span-1 flex items-center justify-center">
                <div className="hidden md:flex flex-col items-center text-center text-gray-300">
                  <div className="flex items-center gap-4">
                    <span className="arrow pulse text-cyan-300 text-2xl">←</span>
                    <div className="text-xl font-semibold">ScaleHub</div>
                    <span className="arrow pulse text-cyan-300 text-2xl">→</span>
                  </div>
                  <div className="mt-3 text-sm text-gray-400">Connecting customers and local service providers.</div>
                </div>

                <div className="flex md:hidden flex-col items-center text-sm text-gray-300">
                  <div className="text-sm font-medium">Customer</div>
                  <div className="arrow text-cyan-300 my-2">↓</div>
                  <div className="text-sm font-medium">ScaleHub</div>
                  <div className="arrow text-cyan-300 my-2">↓</div>
                  <div className="text-sm font-medium">Provider</div>
                  <div className="mt-2 text-xs text-gray-400">Connecting customers and local service providers.</div>
                </div>
              </div>

              {/* Right: Provider dashboard mock */}
              <div className="md:col-span-1 scalehub-card p-5 scalehub-fade-up scalehub-delay-400 scalehub-float card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Incoming Requests</div>
                    <div className="text-lg font-semibold">Today</div>
                  </div>
                  <div className="text-xs text-gray-400">3 new</div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="p-3 rounded bg-slate-900/60 flex items-center justify-between">
                    <div>
                      <div className="font-medium">Maria</div>
                      <div className="text-xs text-gray-400">10:00 AM — Basic Cut</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="px-3 py-1 rounded scalehub-button-primary text-sm">Confirm</button>
                      <div className="text-xs text-gray-400">Pending</div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-slate-900/60 flex items-center justify-between">
                    <div>
                      <div className="font-medium">Omar</div>
                      <div className="text-xs text-gray-400">11:30 AM — Premium Cut</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="px-3 py-1 rounded scalehub-button-secondary text-sm">Decline</button>
                      <div className="text-xs text-gray-400">Requested</div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-slate-900/60 flex items-center justify-between">
                    <div>
                      <div className="font-medium">Alex</div>
                      <div className="text-xs text-gray-400">1:00 PM — Massage</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-xs text-gray-400">Confirmed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 px-4">
            <div className="p-4 rounded-lg bg-slate-900/70 border border-gray-800 text-center">✓ No customer account required</div>
            <div className="p-4 rounded-lg bg-slate-900/70 border border-gray-800 text-center">✓ Providers control confirmations</div>
            <div className="p-4 rounded-lg bg-slate-900/70 border border-gray-800 text-center">✓ QR-code booking profiles</div>
            <div className="p-4 rounded-lg bg-slate-900/70 border border-gray-800 text-center">✓ Built for local services nationwide</div>
          </div>
        </div>
      </div>
    </div>
  )
}
