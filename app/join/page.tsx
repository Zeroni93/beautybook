import JoinForm from '@/components/JoinForm'
import Link from 'next/link'

export default function Join() {
  return (
    <div className="px-5 py-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Value proposition */}
        <div className="space-y-6 scalehub-fade-up">
          <div className="p-6 scalehub-card anim-smooth">
            <h1 className="text-3xl font-bold">Grow your local service business</h1>
            <p className="mt-2 text-gray-300">Create a booking profile, share your link or QR code, and let customers request appointments without creating an account.</p>

            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li>• $15/month flat provider plan</li>
              <li>• No commissions or booking fees</li>
              <li>• Customers book for free</li>
              <li>• Keep 100% of your earnings</li>
              <li>• Shareable profile link and QR code</li>
              <li>• Manual or automatic booking confirmation</li>
            </ul>

              <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="p-3 scalehub-card text-center">
                <div className="text-sm text-gray-400">Price</div>
                <div className="font-bold text-white mt-1">$15/mo</div>
              </div>
              <div className="p-3 scalehub-card text-center">
                <div className="text-sm text-gray-400">Commission</div>
                <div className="font-bold text-white mt-1">0%</div>
              </div>
              <div className="p-3 scalehub-card text-center">
                <div className="text-sm text-gray-400">Customer</div>
                <div className="font-bold text-white mt-1">Free booking</div>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-500">Questions? See our <Link href="/pricing" className="text-softpink">plan details</Link>.</div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="scalehub-fade-up scalehub-delay-200">
          <div className="p-6 scalehub-card animate-scale-in">
            <h2 className="text-xl font-semibold">Create your provider profile</h2>
            <p className="text-sm text-gray-400 mt-1">This information appears on your public booking page.</p>

            <div className="mt-4">
              <JoinForm />
            </div>

            <div className="mt-4 text-xs text-gray-500">Provider billing is coming soon. No card required during MVP testing.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
