'use client'
import { useState } from 'react'

export default function BoekCoachButton({ lidId, coachId }: { lidId: number; coachId: number }) {
  const [datumTijd, setDatumTijd] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  // Default to tomorrow 10:00
  const tomorrow = new Date(Date.now() + 86400000)
  tomorrow.setHours(10, 0, 0, 0)
  const defaultVal = tomorrow.toISOString().slice(0, 16)

  async function boek() {
    if (!datumTijd) return setMsg('Kies datum/tijd')
    setLoading(true)
    setMsg('')
    try {
      const iso = new Date(datumTijd).toISOString()
      const res = await fetch('/api/coach-afspraken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ lid: lidId, coach: coachId, datumTijd: iso, status: 'Bevestigd' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.errors?.[0]?.message || data.message || 'Boeken mislukt')
      setMsg('✅ Afspraak geboekt!')
    } catch (e: any) {
      setMsg('❌ ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="datetime-local"
        className="w-full border rounded px-2 py-1 text-sm"
        defaultValue={defaultVal}
        onChange={(e) => setDatumTijd(e.target.value)}
      />
      <button onClick={boek} disabled={loading} className="w-full text-xs border px-3 py-2 rounded bg-black text-white disabled:opacity-50">
        {loading ? 'Boeken...' : 'Afspraak plannen'}
      </button>
      {msg && <p className="text-xs">{msg}</p>}
    </div>
  )
}
