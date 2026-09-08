import type { Access } from 'payload'
import type { User } from '@/payload-types'

export const isMedewerker: Access<User> = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'medewerker' || user.role === 'admin'
}

export const isLid: Access<User> = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'lid' || user.role === 'admin' || user.role === 'medewerker'
}

export const isAdmin: Access<User> = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'admin'
}

// Medewerker kan alles lezen, lid alleen eigen data
export const isMedewerkerOrSelf = (field: string = 'id'): Access<User> => {
  return ({ req: { user } }) => {
    if (!user) return false
    if (user.role === 'medewerker' || user.role === 'admin') return true
    // Lid/coach kan alleen eigen record
    return {
      [field]: { equals: user.id },
    } as any
  }
}
