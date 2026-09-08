import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { isMedewerker } from '../access/isMedewerker'

export const Abonnementen: CollectionConfig = {
  slug: 'abonnementen',
  labels: {
    singular: 'Abonnement',
    plural: 'Abonnementen',
  },
  access: {
    create: isMedewerker,
    read: anyone, // nodig voor registratie (publiek kiest abonnement), lid ziet eigen via dashboard
    update: isMedewerker,
    delete: isMedewerker,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['type', 'status', 'heeftCursusAddendum', 'bezoekenDezeWeek', 'startDatum'],
    group: 'Sportschool De Kast',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: '1x per week', value: 'EenKeerPerWeek' },
        { label: '2x per week', value: 'TweeKeerPerWeek' },
        { label: 'Onbeperkt', value: 'Onbeperkt' },
        { label: 'Cursus Addendum', value: 'CursusAddendum' },
      ],
      admin: {
        description: 'Komt overeen met C# Abonnementstype enum',
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
        description: 'Komt overeen met C# Status enum',
      },
    },
    {
      name: 'startDatum',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'eindDatum',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly' },
        description: 'Wordt automatisch gezet bij Annuleer() -> DateTime.UtcNow',
        readOnly: true,
      },
    },
    {
      name: 'bezoekenDezeWeek',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Verhoogd via MagNaarBinnen(). Reset via ResetWeeklimiet()',
      },
    },
    {
      name: 'heeftCursusAddendum',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Nodig voor CursusInschrijving (Lid.SchrijfIn)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        // Annuleer() logica: als status naar Geannuleerd gaat, zet eindDatum
        if (data?.status === 'Geannuleerd' && originalDoc?.status !== 'Geannuleerd') {
          data.eindDatum = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
