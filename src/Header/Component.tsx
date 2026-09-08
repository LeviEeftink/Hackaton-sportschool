import Link from 'next/link'
import React from 'react'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { Logo } from '@/components/Logo/Logo'

export async function Header() {
  const user = await getCurrentUser()
  const role = (user as any)?.role

  return (
    <header className="container relative z-20">
      <div className="py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo loading="eager" priority="high" className="invert dark:invert-0" />
          <span className="font-bold">De Kast</span>
        </Link>
        <nav className="flex gap-4 items-center text-sm">
          <Link href="/cursussen" className="hover:underline">
            Cursussen
          </Link>
          <Link href="/coaches" className="hover:underline">
            Coaches
          </Link>
          {!user ? (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/register" className="border px-3 py-1 rounded hover:bg-black hover:text-white">
                Registreren
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              {(role === 'medewerker' || role === 'admin') && (
                <Link href="/medewerker" className="hover:underline font-semibold">
                  Medewerker
                </Link>
              )}
              <Link href="/admin" className="hover:underline">
                Admin
              </Link>
              <span className="text-muted-foreground hidden md:inline">| {user.email} ({role})</span>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
