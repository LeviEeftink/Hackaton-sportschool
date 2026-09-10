import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/kast/AuthLayout'
import RegisterForm from './RegisterForm'
export const metadata = { title: 'Lid worden' }
export default async function RegisterPage() {
  if (await getCurrentUser()) redirect('/dashboard')
  return (
    <AuthLayout>
      <h1>Lid worden</h1>
      <p className="auth-description">Maak een account en kies je abonnement.</p>
      <RegisterForm />
      <p className="auth-bottom">
        Al een account? <Link href="/login">Log hier in</Link>
      </p>
    </AuthLayout>
  )
}
