import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="auth-page">
      <div className="auth-content">{children}</div>
    </main>
  )
}
