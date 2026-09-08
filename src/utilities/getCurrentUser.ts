import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getCurrentUser() {
  try {
    const payload = await getPayload({ config: configPromise })
    const reqHeaders = await headers()
    const { user } = await payload.auth({ headers: reqHeaders })
    return user || null
  } catch (e) {
    return null
  }
}

export async function getCurrentUserWithLid() {
  const user = await getCurrentUser()
  if (!user) return null

  try {
    const payload = await getPayload({ config: configPromise })
    // Re-fetch user with depth to populate lid/medewerker/coach
    const fullUser: any = await payload.findByID({
      collection: 'users',
      id: user.id,
      depth: 2,
      overrideAccess: true,
    })

    // If user is lid, fetch lid with abonnement
    let lidData: any = null
    let abonnementData: any = null
    if (fullUser.role === 'lid' && fullUser.lid) {
      const lidId = typeof fullUser.lid === 'object' ? fullUser.lid.id : fullUser.lid
      lidData = await payload.findByID({
        collection: 'leden',
        id: lidId,
        depth: 2,
        overrideAccess: true,
      })
      if (lidData?.abonnement) {
        abonnementData = typeof lidData.abonnement === 'object' ? lidData.abonnement : null
        if (!abonnementData && lidData.abonnement) {
          abonnementData = await payload.findByID({
            collection: 'abonnementen',
            id: typeof lidData.abonnement === 'object' ? lidData.abonnement.id : lidData.abonnement,
            depth: 0,
            overrideAccess: true,
          })
        }
      }
    }

    return { user: fullUser, lid: lidData, abonnement: abonnementData }
  } catch (e) {
    return { user, lid: null, abonnement: null }
  }
}
