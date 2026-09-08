import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })
    const { name, email, password, abonnementId } = await req.json()

    if (!name || !email || !password || !abonnementId) {
      return Response.json({ message: 'Alle velden verplicht' }, { status: 400 })
    }

    // Check of email al bestaat
    const existingUser = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })
    if (existingUser.totalDocs > 0) {
      return Response.json({ message: 'Email is al in gebruik' }, { status: 400 })
    }
    const existingLid = await payload.find({
      collection: 'leden',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })
    if (existingLid.totalDocs > 0) {
      return Response.json({ message: 'Lid met deze email bestaat al' }, { status: 400 })
    }

    // Check abonnement bestaat en actief
    const abonnement = await payload.findByID({
      collection: 'abonnementen',
      id: Number(abonnementId),
      overrideAccess: true,
    })
    if (!abonnement || abonnement.status !== 'Actief') {
      return Response.json({ message: 'Ongeldig abonnement' }, { status: 400 })
    }

    // Maak Lid aan
    const lid = await payload.create({
      collection: 'leden',
      data: {
        naam: name,
        email,
        status: 'Actief',
        abonnement: Number(abonnementId),
      },
      overrideAccess: true,
    })

    // Maak User aan en koppel lid
    const user = await payload.create({
      collection: 'users',
      data: {
        name,
        email,
        password,
        role: 'lid',
        lid: lid.id,
      },
      overrideAccess: true,
    })

    return Response.json({ message: 'Registratie gelukt', user: { id: user.id, email: user.email }, lid: { id: lid.id } })
  } catch (err: any) {
    console.error('register-lid error', err)
    return Response.json({ message: err.message || 'Registratie mislukt' }, { status: 500 })
  }
}
