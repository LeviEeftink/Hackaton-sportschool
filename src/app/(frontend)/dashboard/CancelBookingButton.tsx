'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export function CancelBookingButton({id,collection}:{id:number;collection:'cursus-inschrijvingen'|'coach-afspraken'}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[confirm,setConfirm]=useState(false)
  const router=useRouter()
  async function cancel(){setBusy(true);setError('');try{const res=await fetch(`/api/${collection}/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:'Geannuleerd'})});if(!res.ok)throw new Error('Annuleren lukt niet. Probeer opnieuw.');setConfirm(false);router.refresh()}catch(err){setError(err instanceof Error?err.message:'Geen verbinding.')}finally{setBusy(false)}}
  return <div>{confirm?<span className="booking-actions"><button className="cancel-button" disabled={busy} onClick={cancel}>{busy?'Annuleren...':'Ja, annuleren'}</button><button className="cancel-button" disabled={busy} onClick={()=>setConfirm(false)}>Behouden</button></span>:<button className="cancel-button" onClick={()=>setConfirm(true)}>Annuleren</button>}{error&&<p className="feedback feedback-error" role="alert">{error}</p>}</div>
}
