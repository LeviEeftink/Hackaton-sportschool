'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
export default function LogoutButton({compact=false}:{compact?:boolean}) {
  const router=useRouter(),[busy,setBusy]=useState(false),[error,setError]=useState(false)
  async function logout(){setBusy(true);setError(false);try{const res=await fetch('/api/users/logout',{method:'POST'});if(!res.ok)throw new Error();router.push('/login');router.refresh()}catch{setError(true)}finally{setBusy(false)}}
  return <><button type="button" aria-label="Uitloggen" title="Uitloggen" onClick={logout} disabled={busy} className={compact?'icon-button':'button button-outline button-small'}><LogOut size={16}/>{!compact&&(busy?'Even geduld...':'Uitloggen')}</button>{error&&<span role="alert" className="feedback feedback-error">Uitloggen mislukt. Probeer opnieuw.</span>}</>
}
