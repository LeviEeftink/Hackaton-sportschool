'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowUpRight,
  Menu,
  X,
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings2,
} from 'lucide-react'

const portalPaths = ['/dashboard', '/cursussen', '/coaches', '/medewerker']
export function SiteNavigation({ signedIn, staff }: { signedIn: boolean; staff: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  if (portalPaths.some((path) => pathname.startsWith(path))) return null
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="home-link">
          Home
        </Link>
        <nav className="desktop-nav" aria-label="Hoofdnavigatie">
          <Link href="/#aanbod">Ons aanbod</Link>
          <Link href="/#abonnementen">Abonnementen</Link>
        </nav>
        <div className="header-actions">
          <Link href={signedIn ? '/dashboard' : '/login'} className="text-link">
            {signedIn ? 'Mijn De Kast' : 'Inloggen'}
          </Link>
          <Link
            href={signedIn ? (staff ? '/medewerker' : '/dashboard') : '/register'}
            className="button button-dark button-small"
          >
            {signedIn ? 'Naar mijn overzicht' : 'Word lid'}
          </Link>
        </div>
        <button
          className="mobile-menu-toggle"
          aria-label={open ? 'Menu sluiten' : 'Menu openen'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Mobiele navigatie"
          onClick={() => setOpen(false)}
        >
          <Link href="/#aanbod">Ons aanbod</Link>
          <Link href="/#abonnementen">Abonnementen</Link>
          <Link href={signedIn ? '/dashboard' : '/login'}>
            {signedIn ? 'Mijn De Kast' : 'Inloggen'}
          </Link>
          <Link href="/register">
            Word lid <ArrowUpRight size={16} />
          </Link>
        </nav>
      )}
    </header>
  )
}

export function PortalNavigation({ staff = false }: { staff?: boolean }) {
  const pathname = usePathname()
  const links = [
    { href: '/dashboard', label: 'Mijn overzicht', icon: LayoutDashboard },
    { href: '/cursussen', label: 'Cursussen', icon: CalendarDays },
    { href: '/coaches', label: 'Coaches', icon: Users },
    ...(staff ? [{ href: '/medewerker', label: 'Ledenbeheer', icon: Settings2 }] : []),
  ]
  return (
    <nav className="portal-nav" aria-label="Mijn De Kast">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? 'page' : undefined}
          className={pathname === href ? 'active' : ''}
        >
          <Icon size={19} />
          <span>{label}</span>
          {pathname === href && <span className="nav-indicator" />}
        </Link>
      ))}
    </nav>
  )
}

export function SiteFooter() {
  const pathname = usePathname()
  if (portalPaths.some((path) => pathname.startsWith(path))) return null
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Sportschool De Kast</span>
      <nav aria-label="Footernavigatie">
        <Link href="/#aanbod">Ons aanbod</Link>
        <Link href="/login">Mijn De Kast</Link>
      </nav>
    </footer>
  )
}
