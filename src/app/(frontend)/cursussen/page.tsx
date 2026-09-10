import { getCurrentUserWithLid } from '@/utilities/getCurrentUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import type { User, Abonnementen, Leden } from '@/payload-types'
import { Dumbbell, Info, CalendarDays } from 'lucide-react'
import { PortalShell, PageHeading, EmptyState, StatusPill } from '@/components/kast/PortalShell'
import { dateLabel, timeLabel } from '@/components/kast/format'
import BoekCursusButton from './BoekButton'
export const metadata={title:'Cursussen'}
export default async function CursussenPage(){
  const data=await getCurrentUserWithLid();if(!data?.user)redirect('/login')
  const user=data.user as User,lid=data.lid as Leden|null,subscription=data.abonnement as Abonnementen|null,payload=await getPayload({config})
  const courses=await payload.find({collection:'cursussen',where:{status:{equals:'Actief'}},limit:100,depth:0,user,overrideAccess:false})
  const canBook=Boolean(lid&&lid.status==='Actief'&&subscription?.status==='Actief'&&subscription.heeftCursusAddendum)
  return <PortalShell name={user.name} staff={user.role==='admin'||user.role==='medewerker'}><PageHeading eyebrow="SAMEN KOM JE VERDER" title="Vind jouw energie." description="Kies een cursus en maak ruimte voor een nieuw sportmoment."/><div className="notice"><Info size={17}/><span>{canBook?'Je hebt cursusrecht. Kies hieronder een beschikbaar moment om mee te doen.':'Om een cursus te boeken heb je een actief lidmaatschap met cursusrecht nodig. De balie helpt je graag.'}</span></div>{courses.docs.length?<div className="catalog-grid">{courses.docs.map((course,index)=>{const moments=(course.beschikbareMomenten||[]).filter(m=>new Date(m.moment).getTime()>Date.now()).sort((a,b)=>new Date(a.moment).getTime()-new Date(b.moment).getTime());return <article className="catalog-card" key={course.id}><div className="catalog-art"><span>{String(index+1).padStart(2,'0')} / SAMEN IN BEWEGING</span><Dumbbell size={65} strokeWidth={1}/></div><div className="catalog-content"><div className="catalog-title"><h2>{course.naam}</h2><StatusPill value={course.status}/></div><p className="catalog-subtitle">{moments.length} toekomstige {moments.length===1?'moment':'momenten'} · Tijden in Nederland</p>{moments.length?moments.map(m=><div className="session-row" key={m.id||m.moment}><span>{dateLabel(m.moment)}<small>{timeLabel(m.moment)}</small></span>{lid?<BoekCursusButton lidId={lid.id} cursusId={course.id} moment={m.moment} disabled={!canBook}/>:<CalendarDays size={18}/>}</div>):<EmptyState title="Nieuwe momenten volgen" description="Er staan nog geen toekomstige momenten gepland voor deze cursus."/>}</div></article>})}</div>:<section className="content-panel"><EmptyState title="Het aanbod krijgt vorm" description="Er zijn momenteel geen actieve cursussen. Kijk later nog eens of informeer bij de balie."/></section>}</PortalShell>
}
