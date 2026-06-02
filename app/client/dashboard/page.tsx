import DeleteAccount from '@/components/DeleteAccount'

export const metadata = {
  title: 'Client' 
}

export default function ClientDashboardPage() {
  return (
    <main className="p-4 max-w-3xl mx-auto">
  <h1 className="text-2xl font-bold">Client</h1>
  <p className="text-sm text-gray-400">Customer accounts are not required in ScaleHub. Bookings are created with name and phone number at the provider page.</p>
      <div className="mt-6">
        <DeleteAccount />
      </div>
    </main>
  )
}

