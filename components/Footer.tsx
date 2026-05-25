export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-900 py-6 bg-black">
      <div className="max-w-3xl mx-auto px-5">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-center text-sm text-gray-400">
          <div className="opacity-90">
            Powered by <span className="text-softpink font-medium">Sonoran Kid Development</span>
          </div>

          <div className="hidden md:block mx-3 w-px h-4 bg-gray-800 opacity-60" />

          <div className="opacity-80">© 2026 BeautyBook — Las Vegas</div>
        </div>
      </div>
    </footer>
  )
}
