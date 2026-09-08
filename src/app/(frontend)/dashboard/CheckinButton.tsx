'use client'
import { useState } from 'react'

export default function CheckinButton({ lidId }: { lidId: number }) {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  async function checkin() {
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/toegangspogingen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lid: lidId, datumTijd: new Date().toISOString() }),
        // geen resultaat meegeven -> hook berekent automatisch (MagNaarBinnen)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.errors?.[0]?.message || data.message || 'Mislukt')
      setMsg(`Resultaat: ${data.doc.resultaat} — ${data.doc.reden}`)
      // refresh na 1s
      setTimeout(() => window.location.reload(), 1000)
    } catch (e: any) {
      setMsg('Fout: ' + e.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex items-center gap-2">
      <button onClick={checkin} disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">
        {loading ? '...' : 'Inchecken (ControleerToegang)'}
      </button>
      {msg && <span className="text-sm">{msg}</span>}
    </div>
  )
}
