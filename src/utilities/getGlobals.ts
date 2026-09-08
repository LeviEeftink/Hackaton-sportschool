import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  try {
    const global = await payload.findGlobal({
      slug,
      depth,
    })
    return global
  } catch (err) {
    // Globals header/footer zijn verwijderd in Sportschool De Kast setup.
    // Geef fallback terug zodat frontend niet 500 geeft.
    // @ts-expect-error fallback
    return { navItems: [] } as DataFromGlobalSlug<T>
  }
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0) =>
  unstable_cache(async () => getGlobal<T>(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
