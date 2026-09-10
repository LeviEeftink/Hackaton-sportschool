'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
export default function BoekCoachButton({lidId,coachId,disabled}:{lidId:number;coachId:number;disabled?:boolean}) {
  const [date,setDate]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[failed,setFailed]=useState(false),[booked,setBooked]=useState(false)
  const router=useRouter()
  async function book(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage('');try{if(new Date(date).getTime()<=Date.now())throw new Error('Kies een moment in de toekomst.');const res=await fetch('/api/coach-afspraken',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lid:lidId,coach:coachId,datumTijd:new Date(date).toISOString(),status:'Bevestigd'})});const data=await res.json();if(!res.ok)throw new Error(data.errors?.[0]?.message||'Dit moment kan niet worden geboekt.');setFailed(false);setBooked(true);setMessage('Je afspraak staat in je overzicht.');router.refresh()}catch(err){setFailed(true);setMessage(err instanceof Error?err.message:'Geen verbinding. Probeer opnieuw.')}finally{setBusy(false)}}
  return <form onSubmit={book} className="coach-booking"><div className="field"><label htmlFor={`coach-date-${coachId}`}>Kies je datum en tijd</label><input id={`coach-date-${coachId}`} type="datetime-local" required value={date} onChange={e=>{setDate(e.target.value);setBooked(false)}} disabled={disabled}/><small>Vul het tijdstip in volgens de tijdzone van je apparaat.</small></div><button className="button button-dark" disabled={busy||disabled||booked}>{booked?'Afspraak geboekt':busy?'Afspraak plannen...':'Plan een afspraak'}<ArrowUpRight size={16}/></button>{message&&<p className={`feedback ${failed?'feedback-error':''}`} role={failed?'alert':'status'}>{message}</p>}</form>
}
