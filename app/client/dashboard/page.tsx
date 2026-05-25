import ClientAppointments from '@/components/ClientAppointments'
import DeleteAccount from '@/components/DeleteAccount'

export const metadata = {
  title: 'Your Appointments'
}

export default function ClientDashboardPage() {
  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Your Appointments</h1>
      <p className="text-sm text-gray-400">Manage the appointments you requested.</p>
      <div className="mt-4">
        <ClientAppointments />
      </div>
      <div className="mt-6">
        <DeleteAccount />
      </div>
    </main>
  )
}

