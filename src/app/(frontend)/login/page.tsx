import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/kast/AuthLayout'
import LoginForm from './LoginForm'
export const metadata = { title: 'Inloggen' }
export default async function LoginPage() {
  if (await getCurrentUser()) redirect('/dashboard')
  return (
    <AuthLayout>
      <h1>Inloggen</h1>
      <p className="auth-description">Log in om je abonnement en boekingen te bekijken.</p>
      <LoginForm />
      <p className="auth-bottom">
        Nog geen lid? <Link href="/register">Word lid</Link>
      </p>
    </AuthLayout>
  )
}
