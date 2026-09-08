'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Abonnement = {
  id: number
  type: string
  heeftCursusAddendum: boolean
  label?: string
}

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [abonnementId, setAbonnementId] = useState<string>('')
  const [abonnementen, setAbonnementen] = useState<Abonnement[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/abonnementen?limit=100')
      .then((r) => r.json())
      .then((data) => {
        setAbonnementen(data.docs || [])
        if (data.docs?.[0]) setAbonnementId(String(data.docs[0].id))
      })
      .catch(() => {})
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // 1. Maak Lid aan via payload API? Maar Leden is alleen voor medewerker.
      // We doen het via custom register endpoint: eerst abonnement kiezen, dan lid + user via /api/register-lid
      const res = await fetch('/api/register-lid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, abonnementId: Number(abonnementId) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registratie mislukt')

      // Auto login na registratie
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!loginRes.ok) throw new Error('Registratie gelukt, maar inloggen mislukt')
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function labelFor(a: Abonnement) {
    const typeLabel =
      a.type === 'EenKeerPerWeek' ? '1x/week' : a.type === 'TweeKeerPerWeek' ? '2x/week' : a.type === 'Onbeperkt' ? 'Onbeperkt' : a.type
    return `${typeLabel} ${a.heeftCursusAddendum ? '+ Cursus' : ''} (#${a.id})`
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border p-6 rounded-lg">
      <div>
        <label className="block text-sm font-medium mb-1">Naam</label>
        <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Wachtwoord</label>
        <input className="w-full border rounded px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Abonnement (credits)</label>
        <select className="w-full border rounded px-3 py-2" value={abonnementId} onChange={(e) => setAbonnementId(e.target.value)} required>
          {abonnementen.map((a) => (
            <option key={a.id} value={String(a.id)}>
              {labelFor(a)}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground mt-1">1x/week = 1 credit/week, 2x/week = 2 credits, Onbeperkt = ∞. +Cursus = mag cursussen boeken.</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="w-full bg-black text-white rounded px-4 py-2 disabled:opacity-50">
        {loading ? 'Registreren...' : 'Account aanmaken'}
      </button>
    </form>
  )
}
