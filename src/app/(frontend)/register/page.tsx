import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect } from 'next/navigation'
import RegisterForm from './RegisterForm'

export default async function RegisterPage() {
  const user = await getCurrentUser()
  if (user) redirect('/dashboard')
  return (
    <div className="container max-w-md mx-auto py-16">
      <h1 className="text-3xl font-bold mb-2">Registreren</h1>
      <p className="text-muted-foreground mb-6">Maak een account als lid. Kies je abonnement.</p>
      <RegisterForm />
      <p className="mt-4 text-sm">
        Al een account? <a href="/login" className="underline">Inloggen</a>
      </p>
    </div>
  )
}
