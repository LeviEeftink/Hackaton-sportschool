import { getCurrentUserWithLid } from '@/utilities/getCurrentUser'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import LogoutButton from './LogoutButton'
import CheckinButton from './CheckinButton'
import Link from 'next/link'

function getMaxForType(type: string) {
  if (type === 'EenKeerPerWeek') return 1
  if (type === 'TweeKeerPerWeek') return 2
  if (type === 'Onbeperkt') return Infinity
  return 0
}

export default async function DashboardPage() {
  const data = await getCurrentUserWithLid()
  if (!data?.user) redirect('/login')

  const { user, lid, abonnement } = data
  const role = user.role

  // Medewerker dashboard
  if (role === 'medewerker' || role === 'admin') {
    const payload = await getPayload({ config })
    const [ledenRes, inschrijvingenRes, afsprakenRes, toegangRes] = await Promise.all([
      payload.find({ collection: 'leden', limit: 100, overrideAccess: true }),
      payload.find({ collection: 'cursus-inschrijvingen', limit: 20, depth: 2, sort: '-createdAt', overrideAccess: true }),
      payload.find({ collection: 'coach-afspraken', limit: 20, depth: 2, sort: '-createdAt', overrideAccess: true }),
      payload.find({ collection: 'toegangspogingen', limit: 20, depth: 1, sort: '-createdAt', overrideAccess: true }),
    ])

    return (
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Medewerker Dashboard</h1>
          <LogoutButton />
        </div>
        <p className="mb-4">Ingelogd als {user.name} ({user.email}) — rol: {role}</p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded p-4">
            <h3 className="font-semibold">Leden</h3>
            <p className="text-2xl">{ledenRes.totalDocs}</p>
            <a href="/admin/collections/leden" className="text-sm underline">Beheren in admin</a>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-semibold">Inschrijvingen</h3>
            <p className="text-2xl">{inschrijvingenRes.totalDocs}</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-semibold">Coach Afspraken</h3>
            <p className="text-2xl">{afsprakenRes.totalDocs}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Recente leden</h2>
            <div className="border rounded divide-y">
              {ledenRes.docs.slice(0, 5).map((l: any) => (
                <div key={l.id} className="p-3 flex justify-between">
                  <span>{l.naam} — {l.email}</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded">{l.status}</span>
                </div>
              ))}
            </div>
            <Link href="/medewerker" className="text-sm underline mt-2 inline-block">→ Uitgebreid beheer</Link>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Recente toegangspogingen</h2>
            <div className="border rounded divide-y">
              {toegangRes.docs.map((t: any) => (
                <div key={t.id} className="p-3 text-sm flex justify-between">
                  <span>Lid {typeof t.lid === 'object' ? t.lid.naam : t.lid} — {new Date(t.datumTijd).toLocaleString()}</span>
                  <span className={t.resultaat === 'Toegestaan' ? 'text-green-600' : 'text-red-600'}>{t.resultaat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border p-4 rounded">
          <h3 className="font-semibold mb-2">Snel acties</h3>
          <div className="flex gap-2 flex-wrap">
            <Link href="/admin/collections/leden?create" className="border px-3 py-2 rounded text-sm">+ Lid aanmaken</Link>
            <Link href="/admin/collections/abonnementen" className="border px-3 py-2 rounded text-sm">Abonnementen beheren</Link>
            <Link href="/admin/collections/cursussen" className="border px-3 py-2 rounded text-sm">Cursussen beheren</Link>
            <Link href="/cursussen" className="border px-3 py-2 rounded text-sm">Bekijk cursussen (als lid)</Link>
          </div>
        </div>
      </div>
    )
  }

  // Lid / coach dashboard
  if (!lid) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold">Geen lid profiel gekoppeld</h1>
        <p>Neem contact op met receptie.</p>
        <LogoutButton />
      </div>
    )
  }

  const payload = await getPayload({ config })
  const lidId = lid.id
  const [inschrijvingen, afspraken, toegang] = await Promise.all([
    payload.find({ collection: 'cursus-inschrijvingen', where: { lid: { equals: lidId } }, depth: 2, limit: 20, sort: '-createdAt', overrideAccess: true }),
    payload.find({ collection: 'coach-afspraken', where: { lid: { equals: lidId } }, depth: 2, limit: 20, sort: '-createdAt', overrideAccess: true }),
    payload.find({ collection: 'toegangspogingen', where: { lid: { equals: lidId } }, depth: 1, limit: 10, sort: '-createdAt', overrideAccess: true }),
  ])

  const max = abonnement ? getMaxForType(abonnement.type) : 0
  const gebruikt = abonnement?.bezoekenDezeWeek ?? 0
  const resterend = max === Infinity ? '∞' : Math.max(0, max - gebruikt)
  const heeftAddendum = abonnement?.heeftCursusAddendum

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welkom, {lid.naam}</h1>
        <LogoutButton />
      </div>

      {/* Credits kaart */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-lg p-6 bg-black text-white">
          <h3 className="text-sm opacity-70">Abonnement</h3>
          <p className="text-xl font-bold">{abonnement?.type || 'Geen'}</p>
          <p className="text-sm opacity-70">Status: {abonnement?.status}</p>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-sm text-muted-foreground">Credits deze week</h3>
          <p className="text-3xl font-bold">{gebruikt} / {max === Infinity ? '∞' : max}</p>
          <p className="text-sm">Resterend: {resterend}</p>
          <div className="w-full bg-muted h-2 rounded mt-2">
            <div className="bg-black h-2 rounded" style={{ width: max === Infinity ? '100%' : `${Math.min(100, (gebruikt / max) * 100)}%` }} />
          </div>
        </div>
        <div className="border rounded-lg p-6">
          <h3 className="text-sm text-muted-foreground">Cursus toegang</h3>
          <p className="text-xl font-bold">{heeftAddendum ? '✅ Ja' : '❌ Nee'}</p>
          <p className="text-xs">{heeftAddendum ? 'Je mag cursussen boeken' : 'Upgrade voor cursussen'}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8 flex-wrap">
        <CheckinButton lidId={lidId} />
        <Link href="/cursussen" className="border px-4 py-2 rounded">Cursussen boeken</Link>
        <Link href="/coaches" className="border px-4 py-2 rounded">Coach afspraak</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">Mijn cursussen</h2>
          {inschrijvingen.docs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nog geen inschrijvingen.</p>
          ) : (
            <div className="space-y-2">
              {inschrijvingen.docs.map((i: any) => (
                <div key={i.id} className="border rounded p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{typeof i.cursus === 'object' ? i.cursus.naam : i.cursus}</p>
                    <p className="text-xs">{new Date(i.moment).toLocaleString()} — {i.status}</p>
                  </div>
                  <CancelInschrijvingButton id={i.id} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Mijn coach afspraken</h2>
          {afspraken.docs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nog geen afspraken.</p>
          ) : (
            <div className="space-y-2">
              {afspraken.docs.map((a: any) => (
                <div key={a.id} className="border rounded p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{typeof a.coach === 'object' ? a.coach.naam : a.coach} — {typeof a.coach === 'object' ? a.coach.specialisatie : ''}</p>
                    <p className="text-xs">{new Date(a.datumTijd).toLocaleString()} — {a.status}</p>
                  </div>
                  <CancelAfspraakButton id={a.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Recente toegang</h3>
        <div className="border rounded divide-y">
          {toegang.docs.map((t: any) => (
            <div key={t.id} className="p-2 text-sm flex justify-between">
              <span>{new Date(t.datumTijd).toLocaleString()}</span>
              <span className={t.resultaat === 'Toegestaan' ? 'text-green-600' : 'text-red-600'}>{t.resultaat} — {t.reden}</span>
            </div>
          ))}
          {toegang.docs.length === 0 && <p className="p-3 text-sm text-muted-foreground">Geen toegangspogingen</p>}
        </div>
      </div>
    </div>
  )
}

function CancelInschrijvingButton({ id }: { id: number }) {
  return (
    <form
      action={async () => {
        'use server'
        const { getPayload } = await import('payload')
        const config = (await import('@payload-config')).default
        const payload = await getPayload({ config })
        await payload.update({ collection: 'cursus-inschrijvingen', id, data: { status: 'Geannuleerd' }, overrideAccess: true })
      }}
    >
      <button className="text-xs border px-2 py-1 rounded">Annuleren</button>
    </form>
  )
}
function CancelAfspraakButton({ id }: { id: number }) {
  return (
    <form
      action={async () => {
        'use server'
        const { getPayload } = await import('payload')
        const config = (await import('@payload-config')).default
        const payload = await getPayload({ config })
        await payload.update({ collection: 'coach-afspraken', id, data: { status: 'Geannuleerd' }, overrideAccess: true })
      }}
    >
      <button className="text-xs border px-2 py-1 rounded">Annuleren</button>
    </form>
  )
}
