'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScanLine } from 'lucide-react'
export default function CheckinButton({lidId}:{lidId:number}) {
  const [message,setMessage]=useState(''),[busy,setBusy]=useState(false),[failed,setFailed]=useState(false)
  const router=useRouter()
  async function checkin(){setBusy(true);setMessage('');setFailed(false);try{const res=await fetch('/api/toegangspogingen',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lid:lidId})});const data=await res.json();if(!res.ok)throw new Error('Inchecken lukt nu niet. Vraag de balie om hulp.');setMessage(`${data.doc.resultaat} — ${data.doc.reden}`);setFailed(data.doc.resultaat==='Geweigerd');router.refresh()}catch(err){setFailed(true);setMessage(err instanceof Error?err.message:'Geen verbinding. Vraag de balie om hulp.')}finally{setBusy(false)}}
  return <div><button className="button button-lime" disabled={busy} onClick={checkin}><ScanLine size={18}/>{busy?'Toegang controleren...':'Check in bij De Kast'}</button>{message&&<p className={`feedback ${failed?'feedback-error':''}`} role={failed?'alert':'status'}>{message}</p>}</div>
}
