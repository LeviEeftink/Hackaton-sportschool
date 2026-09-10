import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { ReactNode } from 'react'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { getServerSideURL } from '@/utilities/getURL'
import './globals.css'

export default function RootLayout({children}: {children:ReactNode}) {
  return <html className={`${GeistSans.variable} ${GeistMono.variable}`} lang="nl" data-theme="light" suppressHydrationWarning><body className="kast-site"><a className="skip-link" href="#main-content">Naar de inhoud</a><Providers><Header/>{children}<Footer/></Providers></body></html>
}
export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {default:'De Kast — Jouw sportzaken, op één plek',template:'%s | De Kast'},
  description:'Train op jouw manier. Beheer je abonnement, check in en boek je volgende cursus of coachafspraak bij Sportschool De Kast.',
  icons:{icon:'/favicon.svg'},
  openGraph:{title:'Sportschool De Kast',description:'Meer bewegen. Meer jezelf.',locale:'nl_NL',siteName:'De Kast',type:'website'},
}
