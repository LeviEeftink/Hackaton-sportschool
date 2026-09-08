import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { isMedewerker } from '../access/isMedewerker'

export const Leden: CollectionConfig = {
  slug: 'leden',
  labels: {
    singular: 'Lid',
    plural: 'Leden',
  },
  access: {
    create: ({ req: { user } }) => {
      if (!user) return false
      // Medewerker kan leden aanmaken, lid kan via registratie (wordt via Users hook)
      return (user as any)?.role === 'medewerker' || (user as any)?.role === 'admin'
    },
    read: ({ req: { user } }) => {
      if (!user) return false
      const role = (user as any)?.role
      if (role === 'medewerker' || role === 'admin') return true
      // Lid mag alleen eigen lid lezen (via Users.lid)
      const lidId = (user as any)?.lid
      const lidVal = typeof lidId === 'object' ? lidId?.id : lidId
      if (!lidVal) return false
      return { id: { equals: lidVal } } as any
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      const role = (user as any)?.role
      if (role === 'medewerker' || role === 'admin') return true
      const lidId = (user as any)?.lid
      const lidVal = typeof lidId === 'object' ? lidId?.id : lidId
      if (!lidVal) return false
      return { id: { equals: lidVal } } as any
    },
    delete: isMedewerker,
  },
  admin: {
    useAsTitle: 'naam',
    defaultColumns: ['naam', 'email', 'status', 'abonnement'],
    group: 'Sportschool De Kast',
  },
  fields: [
    {
      name: 'naam',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'Actief',
      options: [
        { label: 'Actief', value: 'Actief' },
        { label: 'Geannuleerd', value: 'Geannuleerd' },
        { label: 'Inactief', value: 'Inactief' },
        { label: 'Bevestigd', value: 'Bevestigd' },
      ],
    },
    {
      name: 'abonnement',
      type: 'relationship',
      relationTo: 'abonnementen',
      hasMany: false,
      admin: {
        description: '1-op-1 relatie via Lid.KoppelAbonnement(). Optioneel.',
      },
    },
    // Virtual joins - tonen reverse relaties (alleen lezen in admin)
    {
      name: 'cursusInschrijvingen',
      type: 'join',
      collection: 'cursus-inschrijvingen',
      on: 'lid',
      admin: {
        description: 'Automatisch gevuld via Lid.SchrijfIn()',
      },
    },
    {
      name: 'coachAfspraken',
      type: 'join',
      collection: 'coach-afspraken',
      on: 'lid',
      admin: {
        description: 'Automatisch gevuld via Lid.PlanAfspraak()',
      },
    },
    {
      name: 'toegangspogingen',
      type: 'join',
      collection: 'toegangspogingen',
      on: 'lid',
      admin: {
        description: 'Automatisch gevuld via Lid.ControleerToegang()',
      },
    },
  ],
}
