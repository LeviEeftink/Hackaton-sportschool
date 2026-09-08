'use client'
import { useState } from 'react'

export default function BoekCursusButton({ lidId, cursusId, moment, disabled }: { lidId: number; cursusId: number; moment: string; disabled?: boolean }) {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  async function boek() {
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/cursus-inschrijvingen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ lid: lidId, cursus: cursusId, moment, status: 'Bevestigd' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.errors?.[0]?.message || data.message || 'Boeken mislukt')
      setMsg('✅ Geboekt!')
    } catch (e: any) {
      setMsg('❌ ' + e.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex items-center gap-2">
      <button onClick={boek} disabled={loading || disabled} className="text-xs border px-3 py-1 rounded bg-black text-white disabled:opacity-50">
        {loading ? '...' : 'Boeken'}
      </button>
      {msg && <span className="text-xs">{msg}</span>}
    </div>
  )
}
