import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { isMedewerker } from '../../access/isMedewerker'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => {
      return Boolean(user)
    },
    create: () => true,
    delete: isMedewerker,
    read: authenticated,
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (user.role === 'medewerker' || user.role === 'admin') return true
      return user.id === id
    },
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'lid', 'medewerker'],
    useAsTitle: 'name',
    group: 'Auth',
  },
  auth: {
    verify: false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'lid',
      options: [
        { label: 'Lid (regular)', value: 'lid' },
        { label: 'Medewerker (staff)', value: 'medewerker' },
        { label: 'Coach', value: 'coach' },
        { label: 'Admin', value: 'admin' },
      ],
      admin: {
        description: 'Medewerker kan leden beheren, lid kan cursussen boeken.',
      },
      saveToJWT: true,
    },
    {
      name: 'lid',
      type: 'relationship',
      relationTo: 'leden',
      hasMany: false,
      admin: {
        condition: (data) => data?.role === 'lid',
        description: 'Koppel aan Leden profiel (voor credits/abonnement)',
      },
    },
    {
      name: 'medewerker',
      type: 'relationship',
      relationTo: 'medewerkers',
      hasMany: false,
      admin: {
        condition: (data) => data?.role === 'medewerker',
        description: 'Koppel aan Medewerkers profiel',
      },
    },
    {
      name: 'coach',
      type: 'relationship',
      relationTo: 'coaches',
      hasMany: false,
      admin: {
        condition: (data) => data?.role === 'coach',
        description: 'Koppel aan Coaches profiel',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation, context }) => {
        const reqContext = (req as any)?.context || context
        const allowPrivileged = reqContext?.allowPrivilegedRole || reqContext?.seed
        if (operation === 'create' && !allowPrivileged) {
          const requestedRole = data?.role || 'lid'
          if (['medewerker', 'coach', 'admin'].includes(requestedRole)) {
            const user = req.user as any
            const isPrivileged = user?.role === 'medewerker' || user?.role === 'admin'
            if (!isPrivileged) {
              data.role = 'lid'
            }
          }
        }
        return data
      },
    ],
  },
  timestamps: true,
}
