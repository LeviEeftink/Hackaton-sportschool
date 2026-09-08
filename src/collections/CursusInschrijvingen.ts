import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const CursusInschrijvingen: CollectionConfig = {
  slug: 'cursus-inschrijvingen',
  labels: {
    singular: 'Cursus Inschrijving',
    plural: 'Cursus Inschrijvingen',
  },
  access: {
    create: authenticated,
    read: ({ req: { user } }) => {
      if (!user) return false
      const role = (user as any)?.role
      if (role === 'medewerker' || role === 'admin') return true
      const lidId = (user as any)?.lid
      const lidVal = typeof lidId === 'object' ? lidId?.id : lidId
      if (!lidVal) return false
      return { lid: { equals: lidVal } } as any
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      const role = (user as any)?.role
      if (role === 'medewerker' || role === 'admin') return true
      const lidId = (user as any)?.lid
      const lidVal = typeof lidId === 'object' ? lidId?.id : lidId
      if (!lidVal) return false
      return { lid: { equals: lidVal } } as any
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      const role = (user as any)?.role
      if (role === 'medewerker' || role === 'admin') return true
      const lidId = (user as any)?.lid
      const lidVal = typeof lidId === 'object' ? lidId?.id : lidId
      if (!lidVal) return false
      return { lid: { equals: lidVal } } as any
    },
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['lid', 'cursus', 'moment', 'status', 'inschrijfDatum'],
    group: 'Sportschool De Kast',
  },
  fields: [
    {
      name: 'lid',
      type: 'relationship',
      relationTo: 'leden',
      required: true,
      hasMany: false,
    },
    {
      name: 'cursus',
      type: 'relationship',
      relationTo: 'cursussen',
      required: true,
      hasMany: false,
    },
    {
      name: 'moment',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Het gekozen cursusmoment (C# Moment)',
      },
    },
    {
      name: 'inschrijfDatum',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'C# InschrijfDatum - default DateTime.UtcNow, readOnly na create',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'Bevestigd',
      options: [
        { label: 'Actief', value: 'Actief' },
        { label: 'Geannuleerd', value: 'Geannuleerd' },
        { label: 'Inactief', value: 'Inactief' },
        { label: 'Bevestigd', value: 'Bevestigd' },
      ],
      admin: {
        description: 'Via AnnuleerInschrijving() naar Geannuleerd',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Alleen bij create valideren - komt overeen met Lid.SchrijfIn()
        if (operation === 'create' && data?.lid && data?.cursus && data?.moment) {
          const lidId = typeof data.lid === 'object' ? (data.lid as any).id : data.lid
          const cursusId = typeof data.cursus === 'object' ? (data.cursus as any).id : data.cursus

          // Ownership check: lid mag alleen voor eigen lid boeken (tenzij medewerker)
          const user = req.user as any
          if (user && user.role === 'lid') {
            const userLidId = typeof user.lid === 'object' ? user.lid?.id : user.lid
            if (String(userLidId) !== String(lidId)) {
              throw new Error('Je kunt alleen voor jezelf een cursus boeken.')
            }
          }

          // 1. Check HeeftCursusAddendum (overrideAccess true voor systeem-validatie)
          const lid = await req.payload.findByID({
            collection: 'leden',
            id: lidId,
            depth: 1,
            overrideAccess: true,
          })

          const abonnement = lid.abonnement as any
          // abonnement kan een ID of een populated object zijn
          let heeftAddendum = false
          if (abonnement) {
            if (typeof abonnement === 'object' && 'heeftCursusAddendum' in abonnement) {
              heeftAddendum = abonnement.heeftCursusAddendum
            } else {
              // fetch abonnement
              const abonnementDoc = await req.payload.findByID({
                collection: 'abonnementen',
                id: typeof abonnement === 'object' ? abonnement.id : abonnement,
                depth: 0,
                overrideAccess: true,
              })
              heeftAddendum = (abonnementDoc as any).heeftCursusAddendum
            }
          }

          if (!heeftAddendum) {
            throw new Error('Inschrijven is alleen mogelijk met een cursus-addendum.')
          }

          // 2. Check dubbele inschrijving voor zelfde moment + cursus (alleen Bevestigd telt)
          // Gebruik overrideAccess true voor systeem-validatie, anders Forbidden bij authenticated collections
          const existing = await req.payload.find({
            collection: 'cursus-inschrijvingen',
            where: {
              and: [
                { lid: { equals: lidId } },
                { cursus: { equals: cursusId } },
                { moment: { equals: data.moment } },
                { status: { equals: 'Bevestigd' } },
              ],
            },
            limit: 1,
            depth: 0,
            overrideAccess: true,
          })

          if (existing.totalDocs > 0) {
            throw new Error('Het lid is al ingeschreven voor dit cursusmoment.')
          }
        }
        return data
      },
    ],
  },
}
