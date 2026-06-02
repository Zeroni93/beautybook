"use client"
import { useState } from 'react'
import BookingForm from './BookingForm'

export default function BookingModal({ sellerId, services, buttonClassName }: { sellerId: string, services: any[], buttonClassName?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
  <button onClick={() => setOpen(true)} className={buttonClassName ?? 'px-5 py-3 scalehub-button-primary rounded-xl'}>Book Appointment</button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-2xl mx-4">
            <div className="bg-gray-900 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Request Booking</div>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">Close</button>
              </div>
              <div className="mt-4">
                <BookingForm sellerId={sellerId} services={services} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
