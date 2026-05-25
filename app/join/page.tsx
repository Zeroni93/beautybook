import JoinForm from '@/components/JoinForm'

export default function Join() {
  return (
    <div className="px-5 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Join as a Provider</h1>
      <p className="text-sm text-gray-300 mt-1">Create your profile to start receiving booking requests.</p>

      <JoinForm />
    </div>
  )
}
