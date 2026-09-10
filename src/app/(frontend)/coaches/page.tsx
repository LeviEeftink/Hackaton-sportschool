import { getCurrentUserWithLid } from '@/utilities/getCurrentUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import type { User, Leden } from '@/payload-types'
import { Info } from 'lucide-react'
import { PortalShell, PageHeading, EmptyState, StatusPill } from '@/components/kast/PortalShell'
import BoekCoachButton from './BoekCoachButton'
export const metadata={title:'Coaches'}
export default async function CoachesPage(){
  const data=await getCurrentUserWithLid();if(!data?.user)redirect('/login')
  const user=data.user as User,lid=data.lid as Leden|null,payload=await getPayload({config})
  const coaches=await payload.find({collection:'coaches',where:{status:{equals:'Actief'}},limit:100,depth:0,user,overrideAccess:false})
  return <PortalShell name={user.name} staff={user.role==='admin'||user.role==='medewerker'}><PageHeading eyebrow="AANDACHT VOOR JOUW DOELEN" title="Jij zet de stap. Wij helpen." description="Vind een coach en plan een moment om samen verder te komen."/><div className="notice"><Info size={17}/><span>Kies een toekomstig moment. Bij het boeken controleren we of de coach op dat tijdstip beschikbaar is.</span></div>{coaches.docs.length?<div className="catalog-grid">{coaches.docs.map(coach=><article className="catalog-card" key={coach.id}><div className="catalog-art"><span>PERSOONLIJKE COACHING</span><span className="coach-avatar">{coach.naam.split(' ').map(part=>part[0]).slice(0,2).join('')}</span></div><div className="catalog-content"><div className="catalog-title"><h2>{coach.naam}</h2><StatusPill value={coach.status}/></div><p className="catalog-subtitle">{coach.specialisatie}</p>{lid?<BoekCoachButton lidId={lid.id} coachId={coach.id} disabled={lid.status!=='Actief'}/>:<EmptyState title="Een ledenprofiel nodig" description="Vraag de balie om je profiel te koppelen om een afspraak te plannen."/>}</div></article>)}</div>:<section className="content-panel"><EmptyState title="Even geen coaches beschikbaar" description="Vraag de balie naar de mogelijkheden voor persoonlijke begeleiding."/></section>}</PortalShell>
}
