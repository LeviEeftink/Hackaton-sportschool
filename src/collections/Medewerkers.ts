import type { CollectionConfig } from 'payload'

import { isMedewerker } from '../access/isMedewerker'

export const Medewerkers: CollectionConfig = {
  slug: 'medewerkers',
  labels: {
    singular: 'Medewerker',
    plural: 'Medewerkers',
  },
  access: {
    create: isMedewerker,
    read: isMedewerker,
    update: isMedewerker,
    delete: isMedewerker,
  },
  admin: {
    useAsTitle: 'naam',
    defaultColumns: ['naam', 'email', 'rol', 'status'],
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
      name: 'rol',
      type: 'text',
      required: true,
      admin: {
        description: 'Bijv. Receptie, Beheer, Trainer (C# Rol)',
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
      admin: {
        description: 'Alleen Actieve medewerker mag BeheerAbonnement() uitvoeren',
      },
    },
  ],
}
