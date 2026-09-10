'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
export default function BoekCursusButton({lidId,cursusId,moment,disabled}:{lidId:number;cursusId:number;moment:string;disabled?:boolean}) {
  const [message,setMessage]=useState(''),[busy,setBusy]=useState(false),[booked,setBooked]=useState(false),[failed,setFailed]=useState(false)
  const router=useRouter()
  async function book(){setBusy(true);setMessage('');try{const res=await fetch('/api/cursus-inschrijvingen',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lid:lidId,cursus:cursusId,moment,status:'Bevestigd'})});const data=await res.json();if(!res.ok)throw new Error(data.errors?.[0]?.message||'Boeken lukt niet. Controleer je cursusrecht.');setBooked(true);setFailed(false);setMessage('Je inschrijving staat in je overzicht.');router.refresh()}catch(err){setFailed(true);setMessage(err instanceof Error?err.message:'Geen verbinding. Probeer opnieuw.')}finally{setBusy(false)}}
  return <div><button className="button button-dark button-small" disabled={busy||disabled||booked} onClick={book}>{booked?<><Check size={14}/>Geboekt</>:busy?'Boeken...':'Boek dit moment'}</button>{message&&<p className={`feedback ${failed?'feedback-error':''}`} role={failed?'alert':'status'}>{message}</p>}</div>
}
