'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Eye, EyeOff, LoaderCircle } from 'lucide-react'
export default function LoginForm() {
  const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[visible,setVisible]=useState(false),[error,setError]=useState(''),[loading,setLoading]=useState(false)
  const router=useRouter()
  async function onSubmit(e:React.FormEvent) {
    e.preventDefault();setError('');setLoading(true)
    try {
      const res=await fetch('/api/users/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})})
      if(!res.ok) throw new Error('Inloggen lukt niet. Controleer je e-mailadres en wachtwoord.')
      router.push('/dashboard');router.refresh()
    } catch(err) {setError(err instanceof Error?err.message:'Geen verbinding. Probeer het opnieuw.')} finally {setLoading(false)}
  }
  return <form onSubmit={onSubmit} className="kast-form"><div className="field"><label htmlFor="login-email">E-mailadres</label><input id="login-email" name="email" type="email" autoComplete="email" placeholder="jij@voorbeeld.nl" value={email} onChange={e=>setEmail(e.target.value)} required/></div><div className="field"><label htmlFor="login-password">Wachtwoord</label><div className="password-field"><input id="login-password" name="password" type={visible?'text':'password'} autoComplete="current-password" placeholder="Je wachtwoord" value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" aria-label={visible?'Wachtwoord verbergen':'Wachtwoord tonen'} aria-pressed={visible} onClick={()=>setVisible(!visible)}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></div>{error&&<p className="feedback feedback-error" role="alert">{error}</p>}<button className="button button-dark button-full" disabled={loading}>{loading?<><LoaderCircle size={17} className="animate-spin"/>Even geduld...</>:<>Inloggen <ArrowUpRight size={17}/></>}</button><p className="form-note">Je eigen abonnement, bezoeken en boekingen. Op één plek.</p></form>
}
