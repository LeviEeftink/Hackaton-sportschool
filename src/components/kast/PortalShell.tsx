import type { ReactNode } from 'react'
import Link from 'next/link'
import { PortalNavigation } from './Navigation'
import LogoutButton from '@/app/(frontend)/dashboard/LogoutButton'

export function PortalShell({
  children,
  name,
  staff = false,
}: {
  children: ReactNode
  name: string
  staff?: boolean
}) {
  return (
    <div className="portal">
      <aside className="portal-sidebar">
        <Link href="/" className="portal-home-link">
          Home
        </Link>
        <div className="sidebar-label">MIJN DE KAST</div>
        <PortalNavigation staff={staff} />
        <div className="sidebar-bottom">
          <div className="sidebar-profile">
            <span className="avatar">{name.trim().slice(0, 1).toUpperCase() || 'D'}</span>
            <div>
              <strong>{name}</strong>
              <small>{staff ? 'Medewerker' : 'Lid van De Kast'}</small>
            </div>
            <LogoutButton compact />
          </div>
        </div>
      </aside>
      <div className="portal-body">
        <header className="portal-topbar">
          <span>Mijn De Kast</span>
          <span className="portal-topbar-right">
            <span className="avatar avatar-small">{name.trim().slice(0, 1).toUpperCase()}</span>
          </span>
        </header>
        <main id="main-content" className="portal-content">
          {children}
        </main>
        <footer className="portal-footer">
          <span>SPORTSCHOOL DE KAST</span>
        </footer>
      </div>
    </div>
  )
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}
export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
export function StatusPill({ value }: { value: string }) {
  const positive = ['Actief', 'Bevestigd', 'Toegestaan'].includes(value)
  return (
    <span className={`status-pill ${positive ? 'status-positive' : 'status-muted'}`}>
      <span />
      {value}
    </span>
  )
}
