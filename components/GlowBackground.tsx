import React from 'react'

export default function GlowBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Top-center soft blue glow */}
      <div
        className="absolute left-1/2 top-8 -translate-x-1/2 w-[620px] h-[380px] rounded-full blur-3xl opacity-30 mix-blend-screen"
        style={{ background: 'radial-gradient(closest-side, rgba(0,163,255,0.14), rgba(0,163,255,0.06) 30%, transparent 55%)' }}
      />

      {/* Bottom-corner cyan accent */}
      <div
        className="absolute right-6 bottom-12 w-[420px] h-[280px] rounded-full blur-3xl opacity-22 mix-blend-screen"
        style={{ background: 'radial-gradient(closest-side, rgba(0,220,200,0.12), rgba(0,220,200,0.06) 30%, transparent 55%)' }}
      />

      {/* Subtle center fill to avoid hard edges on very small screens */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(2,8,23,0.02), transparent 30%)' }}
      />
    </div>
  )
}
