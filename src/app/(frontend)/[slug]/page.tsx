import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const pages = await payload.find({
      collection: 'pages' as any,
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    const params = pages.docs
      ?.filter((doc) => {
        return doc.slug !== 'home'
      })
      .map(({ slug }) => {
        return { slug }
      })

    return params
  } catch (err) {
    // pages collection is verwijderd in Sportschool De Kast setup
    return []
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug

  // Sportschool De Kast: pages collection bestaat niet meer — toon fallback voor home
  if (decodedSlug === 'home' || decodedSlug === '') {
    // Probeer nog wel pages, maar fallback naar static sportschool home
    let page: any = null
    try {
      page = await queryPageBySlug({ slug: decodedSlug })
    } catch (e) {
      page = null
    }
    if (page) {
      const { hero, layout } = page
      return (
        <article className="pt-16 pb-24">
          <PageClient />
          <PayloadRedirects disableNotFound url={url} />
          {draft && <LivePreviewListener />}
          <RenderHero {...hero} />
          <RenderBlocks blocks={layout} />
        </article>
      )
    }
    // Fallback: toon Sportschool dashboard als er geen pages zijn
    return (
      <article className="pt-16 pb-24 container">
        <h1 className="text-4xl font-bold mb-4">Sportschool De Kast</h1>
        <p className="mb-6">Payload CMS draait met alleen de domein-collecties (Leden, Abonnementen, Coaches, Cursussen, etc.). De template pages zijn verwijderd.</p>
        <div className="grid gap-2">
          <a className="underline" href="/admin">→ Naar Admin (Payload)</a>
          <a className="underline" href="/admin/collections/leden">→ Leden</a>
          <a className="underline" href="/admin/collections/abonnementen">→ Abonnementen</a>
          <a className="underline" href="/admin/collections/coaches">→ Coaches</a>
          <a className="underline" href="/admin/collections/cursussen">→ Cursussen</a>
        </div>
      </article>
    )
  }

  let page: any | null = null
  try {
    page = await queryPageBySlug({ slug: decodedSlug })
  } catch (e) {
    page = null
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  try {
    const page = await queryPageBySlug({ slug: decodedSlug })
    return generateMeta({ doc: page })
  } catch (e) {
    return generateMeta({ doc: null })
  }
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'pages' as any,
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
      },
    })
    return result.docs?.[0] || null
  } catch (err) {
    return null
  }
})
