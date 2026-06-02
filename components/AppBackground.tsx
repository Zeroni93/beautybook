import React from 'react'

export default function AppBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div
        className="absolute left-1/2 top-12 -translate-x-1/2 w-[840px] h-[540px] rounded-full blur-3xl opacity-40"
        style={{ background: 'radial-gradient(closest-side, rgba(37,99,235,0.36), rgba(14,165,233,0.14) 30%, transparent 55%)' }}
      />

      <div
        className="absolute left-20 bottom-12 w-[520px] h-[360px] rounded-full blur-3xl opacity-26"
        style={{ background: 'radial-gradient(closest-side, rgba(14,165,233,0.18), rgba(59,130,246,0.12) 30%, transparent 55%)' }}
      />

      <div
        className="absolute right-16 top-48 w-[420px] h-[300px] rounded-full blur-3xl opacity-18"
        style={{ background: 'radial-gradient(closest-side, rgba(56,189,248,0.12), rgba(0,163,255,0.06) 30%, transparent 55%)' }}
      />
    </div>
  )
}
