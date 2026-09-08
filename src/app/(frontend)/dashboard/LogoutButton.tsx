'use client'
import { useRouter } from 'next/navigation'
export default function LogoutButton() {
  const router = useRouter()
  async function logout() {
    await fetch('/api/users/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }
  return (
    <button onClick={logout} className="border px-4 py-2 rounded text-sm">
      Uitloggen
    </button>
  )
}
