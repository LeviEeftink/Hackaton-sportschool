import { getCurrentUserWithLid } from '@/utilities/getCurrentUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import CreateLidForm from './CreateLidForm'
import LidActions from './LidActions'

export default async function MedewerkerPage() {
  const data = await getCurrentUserWithLid()
  if (!data?.user) redirect('/login')
  const role = data.user.role
  if (role !== 'medewerker' && role !== 'admin') redirect('/dashboard')

  const payload = await getPayload({ config })
  const leden = await payload.find({ collection: 'leden', limit: 100, depth: 2, overrideAccess: true })
  const abonnementen = await payload.find({ collection: 'abonnementen', limit: 100, overrideAccess: true })
  const cursussen = await payload.find({ collection: 'cursussen', limit: 100, overrideAccess: true })
  const coaches = await payload.find({ collection: 'coaches', limit: 100, overrideAccess: true })

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Medewerker Beheer</h1>
      <p className="text-muted-foreground mb-6">Beheer leden, abonnementen, en bekijk alle data. Alleen voor medewerker/admin.</p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">Leden ({leden.totalDocs})</h2>
          <div className="border rounded divide-y max-h-[600px] overflow-auto">
            {leden.docs.map((l: any) => (
              <div key={l.id} className="p-3">
                <div className="flex justify-between">
                  <span className="font-medium">{l.naam}</span>
                  <span className="text-xs px-2 py-1 bg-muted rounded">{l.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">{l.email}</p>
                <p className="text-xs">
                  Abonnement: {l.abonnement ? `${(l.abonnement as any).type} (${(l.abonnement as any).bezoekenDezeWeek}/${(l.abonnement as any).type === 'EenKeerPerWeek' ? 1 : (l.abonnement as any).type === 'TweeKeerPerWeek' ? 2 : '∞'}) ${ (l.abonnement as any).heeftCursusAddendum ? '+Cursus' : ''} — ${(l.abonnement as any).status}` : 'Geen'}
                </p>
                <LidActions lid={l} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Nieuw lid + user aanmaken</h3>
            <CreateLidForm abonnementen={abonnementen.docs as any} />
          </div>

          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Cursussen ({cursussen.totalDocs})</h3>
            <ul className="text-sm space-y-1">
              {cursussen.docs.map((c: any) => (
                <li key={c.id} className="flex justify-between border-b py-1">
                  <span>{c.naam}</span>
                  <span className="text-xs">{c.beschikbareMomenten?.length || 0} momenten</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Coaches ({coaches.totalDocs})</h3>
            <ul className="text-sm space-y-1">
              {coaches.docs.map((c: any) => (
                <li key={c.id} className="flex justify-between border-b py-1">
                  <span>{c.naam} — {c.specialisatie}</span>
                  <span className="text-xs">{c.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Snel naar admin</h3>
            <div className="flex flex-wrap gap-2">
              <a href="/admin/collections/leden" className="text-xs border px-3 py-1 rounded">Leden admin</a>
              <a href="/admin/collections/abonnementen" className="text-xs border px-3 py-1 rounded">Abonnementen</a>
              <a href="/admin/collections/cursus-inschrijvingen" className="text-xs border px-3 py-1 rounded">Inschrijvingen</a>
              <a href="/admin/collections/toegangspogingen" className="text-xs border px-3 py-1 rounded">Toegang</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
