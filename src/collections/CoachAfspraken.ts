import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const CoachAfspraken: CollectionConfig = {
  slug: 'coach-afspraken',
  labels: {
    singular: 'Coach Afspraak',
    plural: 'Coach Afspraken',
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
    defaultColumns: ['lid', 'coach', 'datumTijd', 'status'],
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
      name: 'coach',
      type: 'relationship',
      relationTo: 'coaches',
      required: true,
      hasMany: false,
    },
    {
      name: 'datumTijd',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'C# DatumTijd - moet uniek zijn per coach (HeeftAfspraak check)',
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
        description: 'Via AnnuleerAfspraak() naar Geannuleerd',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Ownership check
        if (operation === 'create' && data?.lid) {
          const lidId = typeof data.lid === 'object' ? (data.lid as any).id : data.lid
          const user = req.user as any
          if (user && user.role === 'lid') {
            const userLidId = typeof user.lid === 'object' ? user.lid?.id : user.lid
            if (String(userLidId) !== String(lidId)) {
              throw new Error('Je kunt alleen voor jezelf een coach afspraak maken.')
            }
          }
        }
        // Lid.PlanAfspraak() + Coach.HeeftAfspraak() logica
        if (operation === 'create' && data?.coach && data?.datumTijd) {
          const coachId = typeof data.coach === 'object' ? (data.coach as any).id : data.coach

          const existing = await req.payload.find({
            collection: 'coach-afspraken',
            where: {
              and: [
                { coach: { equals: coachId } },
                { datumTijd: { equals: data.datumTijd } },
                { status: { equals: 'Bevestigd' } },
              ],
            },
            limit: 1,
            depth: 0,
            overrideAccess: true,
          })

          if (existing.totalDocs > 0) {
            throw new Error('Dit moment is al bezet door de coach.')
          }
        }
        return data
      },
    ],
  },
}
