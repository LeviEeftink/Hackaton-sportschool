import { getCurrentUserWithLid } from '@/utilities/getCurrentUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import BoekCoachButton from './BoekCoachButton'

export default async function CoachesPage() {
  const data = await getCurrentUserWithLid()
  if (!data?.user) redirect('/login')

  const payload = await getPayload({ config })
  const coaches = await payload.find({ collection: 'coaches', limit: 100, overrideAccess: true })

  const lidId = data.lid?.id

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Coaches</h1>
      <p className="mb-6 text-muted-foreground">Plan een afspraak met een coach. Dubbele boekingen worden geblokkeerd (HeeftAfspraak).</p>

      <div className="grid md:grid-cols-3 gap-6">
        {coaches.docs.map((coach: any) => (
          <div key={coach.id} className="border rounded-lg p-5">
            <h3 className="font-bold">{coach.naam}</h3>
            <p className="text-sm text-muted-foreground mb-1">{coach.specialisatie}</p>
            <p className="text-xs mb-3">{coach.email} — {coach.status}</p>
            {lidId ? (
              <BoekCoachForm lidId={lidId} coachId={coach.id} />
            ) : (
              <p className="text-xs">Geen lid profiel</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function BoekCoachForm({ lidId, coachId }: { lidId: number; coachId: number }) {
  return <BoekCoachButton lidId={lidId} coachId={coachId} />
}
