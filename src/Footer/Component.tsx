import Link from 'next/link'
import React from 'react'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center gap-2" href="/">
          <Logo />
          <span className="font-semibold">Sportschool De Kast</span>
        </Link>
        <div className="text-sm opacity-70">
          <p>Demo — Leden • Coaches • Cursussen • Credits</p>
          <p className="text-xs">Medewerker: medewerker@dekast.nl / medewerker123</p>
        </div>
      </div>
    </footer>
  )
}
