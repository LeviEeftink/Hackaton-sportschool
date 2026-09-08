import { getCurrentUserWithLid } from '@/utilities/getCurrentUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import BoekCursusButton from './BoekButton'

export default async function CursussenPage() {
  const data = await getCurrentUserWithLid()
  if (!data?.user) redirect('/login')

  const payload = await getPayload({ config })
  const cursussen = await payload.find({ collection: 'cursussen', limit: 100, depth: 1, overrideAccess: true })

  const lidId = data.lid?.id
  const abonnement = data.abonnement
  const heeftAddendum = abonnement?.heeftCursusAddendum
  const status = abonnement?.status

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Cursussen</h1>
      <p className="mb-6 text-muted-foreground">
        {heeftAddendum ? 'Je hebt cursus addendum — je kunt boeken.' : '⚠️ Je hebt geen cursus addendum — boekingen zullen falen. Vraag medewerker om upgrade.'}
        {status !== 'Actief' && <span className="text-red-600"> Abonnement niet actief!</span>}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {cursussen.docs.map((c: any) => (
          <div key={c.id} className="border rounded-lg p-5">
            <h3 className="font-bold text-lg">{c.naam}</h3>
            <p className="text-sm text-muted-foreground mb-3">Status: {c.status} — {c.beschikbareMomenten?.length || 0} momenten</p>
            <div className="space-y-2">
              {(c.beschikbareMomenten || []).map((m: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center border rounded px-3 py-2">
                  <span className="text-sm">{new Date(m.moment).toLocaleString()}</span>
                  {lidId ? (
                    <BoekCursusButton lidId={lidId} cursusId={c.id} moment={m.moment} disabled={!heeftAddendum} />
                  ) : (
                    <span className="text-xs">Geen lid</span>
                  )}
                </div>
              ))}
              {(!c.beschikbareMomenten || c.beschikbareMomenten.length === 0) && <p className="text-sm text-muted-foreground">Geen momenten beschikbaar</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
