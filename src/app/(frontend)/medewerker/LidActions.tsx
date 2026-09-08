'use client'
import { useState } from 'react'

export default function LidActions({ lid }: { lid: any }) {
  const abonnement = lid.abonnement as any
  const [msg, setMsg] = useState('')

  async function resetCredits() {
    if (!abonnement) return setMsg('Geen abonnement')
    try {
      const res = await fetch(`/api/abonnementen/${abonnement.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bezoekenDezeWeek: 0 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Mislukt')
      setMsg('✅ Reset naar 0')
      setTimeout(() => window.location.reload(), 800)
    } catch (e: any) {
      setMsg('❌ ' + e.message)
    }
  }

  async function annuleer() {
    if (!abonnement) return
    try {
      const res = await fetch(`/api/abonnementen/${abonnement.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'Geannuleerd' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Mislukt')
      setMsg('✅ Geannuleerd')
      setTimeout(() => window.location.reload(), 800)
    } catch (e: any) {
      setMsg('❌ ' + e.message)
    }
  }

  return (
    <div className="flex gap-2 mt-2">
      <button onClick={resetCredits} className="text-xs border px-2 py-1 rounded">
        Reset credits
      </button>
      <button onClick={annuleer} className="text-xs border px-2 py-1 rounded">
        Annuleer abo
      </button>
      {msg && <span className="text-xs">{msg}</span>}
    </div>
  )
}
