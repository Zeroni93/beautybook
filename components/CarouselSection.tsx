import React, { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
  seeAll?: ReactNode
}

export default function CarouselSection({ title, subtitle, children, seeAll }: Props) {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <div className="text-sm text-gray-400 mt-1 hidden sm:block">{subtitle}</div>}
        </div>

        <div className="text-sm text-gray-400 hidden sm:block">Swipe to explore</div>

        <div>{seeAll}</div>
      </div>

      <div className="mt-4">
        <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-4 py-2 no-scrollbar">
          {children}
        </div>

        <div className="mt-2 text-sm text-gray-400 sm:hidden">Swipe to explore</div>
      </div>
    </section>
  )
}
