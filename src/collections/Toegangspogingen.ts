import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Toegangspogingen: CollectionConfig = {
  slug: 'toegangspogingen',
  labels: {
    singular: 'Toegangspoging',
    plural: 'Toegangspogingen',
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
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      const role = (user as any)?.role
      if (role === 'medewerker' || role === 'admin') return true
      return false
    },
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['lid', 'datumTijd', 'resultaat', 'reden'],
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
      name: 'datumTijd',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'resultaat',
      type: 'select',
      required: true,
      options: [
        { label: 'Toegestaan', value: 'Toegestaan' },
        { label: 'Geweigerd', value: 'Geweigerd' },
      ],
      admin: {
        description: 'C# ResultaatToegang enum',
      },
    },
    {
      name: 'reden',
      type: 'text',
      required: true,
      admin: {
        description: 'C# Reden - bijv. "Geen abonnement gevonden." / "Weeklimiet bereikt."',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        // Ownership check
        if (operation === 'create' && data?.lid) {
          const lidId = typeof data.lid === 'object' ? (data.lid as any).id : data.lid
          const user = req.user as any
          if (user && user.role === 'lid') {
            const userLidId = typeof user.lid === 'object' ? user.lid?.id : user.lid
            if (String(userLidId) !== String(lidId)) {
              throw new Error('Je kunt alleen voor jezelf toegang checken.')
            }
          }
        }
        // Optioneel: hook die Lid.ControleerToegang() + Abonnement.MagNaarBinnen() nabootst
        // Als je via deze collection een toegangspoging aanmaakt zonder resultaat/reden, berekent de hook het automatisch
        if (operation === 'create' && data?.lid && !data?.resultaat) {
          // Probeer automatisch te bepalen op basis van abonnement - alleen als resultaat niet is meegegeven
          // Dit maakt de collection ook bruikbaar als "ControleerToegang" endpoint
          try {
            const lidId = typeof data.lid === 'object' ? (data.lid as any).id : data.lid
            const lid = await req.payload.findByID({
              collection: 'leden',
              id: lidId,
              depth: 2,
              overrideAccess: true,
            })

            if (!lid.abonnement) {
              data.resultaat = 'Geweigerd'
              data.reden = 'Geen abonnement gevonden.'
              if (!data.datumTijd) data.datumTijd = new Date().toISOString()
              return data
            }

            const abonnement = lid.abonnement as any
            const abonnementDoc =
              typeof abonnement === 'object' && abonnement.type
                ? abonnement
                : await req.payload.findByID({
                    collection: 'abonnementen',
                    id: typeof abonnement === 'object' ? abonnement.id : abonnement,
                    depth: 0,
                    overrideAccess: true,
                  })

            if ((abonnementDoc as any).status !== 'Actief') {
              data.resultaat = 'Geweigerd'
              data.reden = 'Het abonnement is niet actief.'
              if (!data.datumTijd) data.datumTijd = new Date().toISOString()
              return data
            }

            const type = (abonnementDoc as any).type
            const bezoeken = (abonnementDoc as any).bezoekenDezeWeek ?? 0

            if (type === 'Onbeperkt') {
              // Mag altijd, verhoog teller
              await req.payload.update({
                collection: 'abonnementen',
                id: abonnementDoc.id,
                data: { bezoekenDezeWeek: bezoeken + 1 },
                depth: 0,
                overrideAccess: true,
              })
              data.resultaat = 'Toegestaan'
              data.reden = 'Toegang toegestaan.'
            } else {
              const maximum = type === 'EenKeerPerWeek' ? 1 : type === 'TweeKeerPerWeek' ? 2 : 0
              if (bezoeken >= maximum) {
                data.resultaat = 'Geweigerd'
                data.reden = 'Weeklimiet bereikt.'
              } else {
                await req.payload.update({
                  collection: 'abonnementen',
                  id: abonnementDoc.id,
                  data: { bezoekenDezeWeek: bezoeken + 1 },
                  depth: 0,
                  overrideAccess: true,
                })
                data.resultaat = 'Toegestaan'
                data.reden = 'Toegang toegestaan.'
              }
            }
            if (!data.datumTijd) data.datumTijd = new Date().toISOString()
          } catch (e) {
            // Als automatische controle faalt, laat validatie het afhandelen
          }
        }
        return data
      },
    ],
  },
}
