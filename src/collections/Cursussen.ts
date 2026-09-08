import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isMedewerker } from '../access/isMedewerker'

export const Cursussen: CollectionConfig = {
  slug: 'cursussen',
  labels: {
    singular: 'Cursus',
    plural: 'Cursussen',
  },
  access: {
    create: isMedewerker,
    read: anyone,
    update: isMedewerker,
    delete: isMedewerker,
  },
  admin: {
    useAsTitle: 'naam',
    defaultColumns: ['naam', 'status'],
    group: 'Sportschool De Kast',
  },
  fields: [
    {
      name: 'naam',
      type: 'text',
      required: true,
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
      admin: {
        description: 'Te wijzigen via Cursus.WijzigStatus()',
      },
    },
    {
      name: 'beschikbareMomenten',
      type: 'array',
      label: 'Beschikbare Momenten',
      admin: {
        description: 'C# List<DateTime> BeschikbareMomenten - via VoegMomentToe()',
      },
      fields: [
        {
          name: 'moment',
          type: 'date',
          required: true,
          admin: {
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
      ],
    },
    {
      name: 'inschrijvingen',
      type: 'join',
      collection: 'cursus-inschrijvingen',
      on: 'cursus',
      admin: {
        description: 'Alle inschrijvingen voor deze cursus (C# Inschrijvingen)',
      },
    },
  ],
}
