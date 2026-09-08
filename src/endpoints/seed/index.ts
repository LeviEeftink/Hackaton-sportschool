import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

// Sportschool De Kast — uitgebreide presets + demo accounts
const collections: CollectionSlug[] = [
  'media',
  'users',
  'abonnementen',
  'leden',
  'coaches',
  'medewerkers',
  'cursussen',
  'cursus-inschrijvingen',
  'coach-afspraken',
  'toegangspogingen',
  'forms',
  'form-submissions',
]

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding Sportschool De Kast database met presets...')

  // Clear collections
  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean((payload.collections[collection]?.config as any)?.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  // ========== ABONNEMENTEN PRESETS (credits) ==========
  payload.logger.info('— Seeding abonnementen presets...')
  const abonnementen = {
    basis1x: await payload.create({
      collection: 'abonnementen',
      data: {
        type: 'EenKeerPerWeek',
        status: 'Actief',
        startDatum: new Date().toISOString(),
        bezoekenDezeWeek: 0,
        heeftCursusAddendum: false,
      },
    }),
    basis1xCursus: await payload.create({
      collection: 'abonnementen',
      data: {
        type: 'EenKeerPerWeek',
        status: 'Actief',
        startDatum: new Date().toISOString(),
        bezoekenDezeWeek: 0,
        heeftCursusAddendum: true,
      },
    }),
    basis2x: await payload.create({
      collection: 'abonnementen',
      data: {
        type: 'TweeKeerPerWeek',
        status: 'Actief',
        startDatum: new Date().toISOString(),
        bezoekenDezeWeek: 0,
        heeftCursusAddendum: false,
      },
    }),
    basis2xCursus: await payload.create({
      collection: 'abonnementen',
      data: {
        type: 'TweeKeerPerWeek',
        status: 'Actief',
        startDatum: new Date().toISOString(),
        bezoekenDezeWeek: 1,
        heeftCursusAddendum: true,
      },
    }),
    premium: await payload.create({
      collection: 'abonnementen',
      data: {
        type: 'Onbeperkt',
        status: 'Actief',
        startDatum: new Date().toISOString(),
        bezoekenDezeWeek: 0,
        heeftCursusAddendum: true,
      },
    }),
    premiumZonderCursus: await payload.create({
      collection: 'abonnementen',
      data: {
        type: 'Onbeperkt',
        status: 'Actief',
        startDatum: new Date().toISOString(),
        bezoekenDezeWeek: 2,
        heeftCursusAddendum: false,
      },
    }),
  }

  // ========== LEDEN PRESETS ==========
  payload.logger.info('— Seeding leden presets...')
  const leden = {
    jan: await payload.create({
      collection: 'leden',
      data: { naam: 'Jan Jansen', email: 'jan@dekast.nl', status: 'Actief', abonnement: abonnementen.premium.id },
    }),
    piet: await payload.create({
      collection: 'leden',
      data: { naam: 'Piet Pietersen', email: 'piet@dekast.nl', status: 'Actief', abonnement: abonnementen.basis1x.id },
    }),
    marie: await payload.create({
      collection: 'leden',
      data: { naam: 'Marie de Vries', email: 'marie@dekast.nl', status: 'Actief', abonnement: abonnementen.basis2xCursus.id },
    }),
    sophie: await payload.create({
      collection: 'leden',
      data: { naam: 'Sophie Bakker', email: 'sophie@dekast.nl', status: 'Actief', abonnement: abonnementen.basis1xCursus.id },
    }),
    thomas: await payload.create({
      collection: 'leden',
      data: { naam: 'Thomas Visser', email: 'thomas@dekast.nl', status: 'Actief', abonnement: abonnementen.basis2x.id },
    }),
  }

  // ========== COACHES PRESETS (5) ==========
  payload.logger.info('— Seeding coaches presets (5)...')
  const coaches = {
    klaas: await payload.create({
      collection: 'coaches',
      data: { naam: 'Klaas Fitness', email: 'klaas@dekast.nl', specialisatie: 'Fitness & Kracht', status: 'Actief' },
    }),
    yara: await payload.create({
      collection: 'coaches',
      data: { naam: 'Yara Yoga', email: 'yara@dekast.nl', specialisatie: 'Yoga & Mindfulness', status: 'Actief' },
    }),
    milan: await payload.create({
      collection: 'coaches',
      data: { naam: 'Milan CrossFit', email: 'milan@dekast.nl', specialisatie: 'CrossFit & HIIT', status: 'Actief' },
    }),
    lisa: await payload.create({
      collection: 'coaches',
      data: { naam: 'Lisa Pilates', email: 'lisa@dekast.nl', specialisatie: 'Pilates & Core', status: 'Actief' },
    }),
    dennis: await payload.create({
      collection: 'coaches',
      data: { naam: 'Dennis Boksen', email: 'dennis@dekast.nl', specialisatie: 'Boksen & Conditie', status: 'Actief' },
    }),
  }

  // ========== MEDEWERKERS PRESETS ==========
  payload.logger.info('— Seeding medewerkers presets...')
  const medewerkers = {
    roos: await payload.create({
      collection: 'medewerkers',
      data: { naam: 'Roos Receptie', email: 'roos@dekast.nl', rol: 'Receptie', status: 'Actief' },
    }),
    bram: await payload.create({
      collection: 'medewerkers',
      data: { naam: 'Bram Beheer', email: 'bram@dekast.nl', rol: 'Beheer', status: 'Actief' },
    }),
    eva: await payload.create({
      collection: 'medewerkers',
      data: { naam: 'Eva Manager', email: 'eva@dekast.nl', rol: 'Manager', status: 'Actief' },
    }),
  }

  // ========== CURSUSSEN PRESETS (6) met momenten ==========
  payload.logger.info('— Seeding cursussen presets (6)...')
  const now = Date.now()
  const dag = 86400000
  const mkMoment = (d: number, h: number) => {
    const dte = new Date(now + d * dag)
    dte.setHours(h, 0, 0, 0)
    return dte.toISOString()
  }

  const cursussen = {
    yoga: await payload.create({
      collection: 'cursussen',
      data: {
        naam: 'Yoga Beginners',
        status: 'Actief',
        beschikbareMomenten: [{ moment: mkMoment(1, 9) }, { moment: mkMoment(3, 9) }, { moment: mkMoment(5, 18) }],
      },
    }),
    crossfit: await payload.create({
      collection: 'cursussen',
      data: {
        naam: 'CrossFit Intro',
        status: 'Actief',
        beschikbareMomenten: [{ moment: mkMoment(1, 18) }, { moment: mkMoment(2, 18) }, { moment: mkMoment(4, 18) }],
      },
    }),
    pilates: await payload.create({
      collection: 'cursussen',
      data: {
        naam: 'Pilates Core',
        status: 'Actief',
        beschikbareMomenten: [{ moment: mkMoment(2, 10) }, { moment: mkMoment(4, 10) }],
      },
    }),
    boksen: await payload.create({
      collection: 'cursussen',
      data: {
        naam: 'Boksen Techniek',
        status: 'Actief',
        beschikbareMomenten: [{ moment: mkMoment(1, 19) }, { moment: mkMoment(3, 19) }],
      },
    }),
    hiit: await payload.create({
      collection: 'cursussen',
      data: {
        naam: 'HIIT Burn',
        status: 'Actief',
        beschikbareMomenten: [{ moment: mkMoment(2, 7) }, { moment: mkMoment(5, 7) }],
      },
    }),
    spinning: await payload.create({
      collection: 'cursussen',
      data: {
        naam: 'Spinning Power',
        status: 'Actief',
        beschikbareMomenten: [{ moment: mkMoment(3, 7) }, { moment: mkMoment(6, 9) }],
      },
    }),
  }

  // ========== DEMO USERS (login) ==========
  payload.logger.info('— Seeding demo users met login...')
  // Medewerker kan inloggen en leden beheren — gebruik context.allowPrivilegedRole zodat hook het toelaat
  const medewerkerUser = await payload.create({
    collection: 'users',
    data: {
      name: 'Roos Receptie (Medewerker)',
      email: 'medewerker@dekast.nl',
      password: 'medewerker123',
      role: 'medewerker',
      medewerker: medewerkers.roos.id,
    },
    context: { allowPrivilegedRole: true },
    overrideAccess: true,
  })
  const adminUser = await payload.create({
    collection: 'users',
    data: {
      name: 'Bram Beheer (Admin)',
      email: 'admin@dekast.nl',
      password: 'admin123',
      role: 'admin',
      medewerker: medewerkers.bram.id,
    },
    context: { allowPrivilegedRole: true },
    overrideAccess: true,
  })
  // Leden kunnen inloggen en boeken
  const lidUserJan = await payload.create({
    collection: 'users',
    data: {
      name: 'Jan Jansen',
      email: 'jan@dekast.nl',
      password: 'lid123',
      role: 'lid',
      lid: leden.jan.id,
    },
    overrideAccess: true,
  })
  const lidUserSophie = await payload.create({
    collection: 'users',
    data: {
      name: 'Sophie Bakker',
      email: 'sophie@dekast.nl',
      password: 'lid123',
      role: 'lid',
      lid: leden.sophie.id,
    },
    overrideAccess: true,
  })
  const lidUserPiet = await payload.create({
    collection: 'users',
    data: {
      name: 'Piet Pietersen',
      email: 'piet@dekast.nl',
      password: 'lid123',
      role: 'lid',
      lid: leden.piet.id,
    },
    overrideAccess: true,
  })
  // Coach user
  await payload.create({
    collection: 'users',
    data: {
      name: 'Klaas Fitness (Coach)',
      email: 'klaas@dekast.nl',
      password: 'coach123',
      role: 'coach',
      coach: coaches.klaas.id,
    },
    context: { allowPrivilegedRole: true },
    overrideAccess: true,
  })

  payload.logger.info('— Seeding voorbeeld boekingen...')
  // Piet heeft geen cursus addendum, dus geen inschrijving voor hem (test credits)
  await payload.create({
    collection: 'cursus-inschrijvingen',
    data: { lid: leden.jan.id, cursus: cursussen.yoga.id, moment: mkMoment(1, 9), status: 'Bevestigd' },
  })
  await payload.create({
    collection: 'cursus-inschrijvingen',
    data: { lid: leden.sophie.id, cursus: cursussen.pilates.id, moment: mkMoment(2, 10), status: 'Bevestigd' },
  })
  await payload.create({
    collection: 'coach-afspraken',
    data: { lid: leden.jan.id, coach: coaches.klaas.id, datumTijd: mkMoment(7, 10), status: 'Bevestigd' },
  })
  await payload.create({
    collection: 'toegangspogingen',
    data: { lid: leden.jan.id, datumTijd: new Date().toISOString(), resultaat: 'Toegestaan', reden: 'Toegang toegestaan.' },
  })
  await payload.create({
    collection: 'toegangspogingen',
    data: { lid: leden.piet.id, datumTijd: new Date().toISOString(), resultaat: 'Geweigerd', reden: 'Weeklimiet bereikt.' },
  })

  payload.logger.info('✅ Seeded Sportschool De Kast database successfully!')
  payload.logger.info('Demo accounts: medewerker@dekast.nl/medewerker123, admin@dekast.nl/admin123, jan@dekast.nl/lid123, sophie@dekast.nl/lid123, piet@dekast.nl/lid123, klaas@dekast.nl/coach123')
}
