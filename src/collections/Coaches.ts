import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isMedewerker } from '../access/isMedewerker'

export const Coaches: CollectionConfig = {
  slug: 'coaches',
  labels: {
    singular: 'Coach',
    plural: 'Coaches',
  },
  access: {
    create: isMedewerker,
    read: anyone,
    update: isMedewerker,
    delete: isMedewerker,
  },
  admin: {
    useAsTitle: 'naam',
    defaultColumns: ['naam', 'email', 'specialisatie', 'status'],
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
      name: 'specialisatie',
      type: 'text',
      required: true,
      admin: {
        description: 'Bijv. Fitness, Yoga, CrossFit (C# Specialisatie)',
      },
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
      name: 'afspraken',
      type: 'join',
      collection: 'coach-afspraken',
      on: 'coach',
      admin: {
        description: 'Alle afspraken van deze coach (Coach.Afspraken)',
      },
    },
  ],
}
