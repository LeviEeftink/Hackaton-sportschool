'use client'
import { useState } from 'react'

export default function CreateLidForm({ abonnementen }: { abonnementen: any[] }) {
  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('lid123')
  const [abonnementId, setAbonnementId] = useState<string>(abonnementen[0]?.id ? String(abonnementen[0].id) : '')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/register-lid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: naam, email, password, abonnementId: Number(abonnementId) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Mislukt')
      setMsg('✅ Lid + user aangemaakt')
      setNaam('')
      setEmail('')
      setTimeout(() => window.location.reload(), 1000)
    } catch (err: any) {
      setMsg('❌ ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <input placeholder="Naam" className="w-full border rounded px-3 py-2 text-sm" value={naam} onChange={(e) => setNaam(e.target.value)} required />
      <input placeholder="Email" type="email" className="w-full border rounded px-3 py-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input placeholder="Password" className="w-full border rounded px-3 py-2 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <select className="w-full border rounded px-3 py-2 text-sm" value={abonnementId} onChange={(e) => setAbonnementId(e.target.value)}>
        {abonnementen.map((a) => (
          <option key={a.id} value={String(a.id)}>
            {a.type} {a.heeftCursusAddendum ? '+Cursus' : ''} — {a.status} ({a.bezoekenDezeWeek})
          </option>
        ))}
      </select>
      <button disabled={loading} className="w-full bg-black text-white rounded px-3 py-2 text-sm disabled:opacity-50">
        {loading ? '...' : 'Aanmaken'}
      </button>
      {msg && <p className="text-xs">{msg}</p>}
    </form>
  )
}
