import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect('/dashboard')

  return (
    <div className="container max-w-md mx-auto py-16">
      <h1 className="text-3xl font-bold mb-2">Inloggen</h1>
      <p className="text-muted-foreground mb-6">Sportschool De Kast — log in als lid of medewerker</p>
      <LoginForm />
      <div className="mt-6 text-sm bg-muted p-4 rounded">
        <p className="font-semibold mb-2">Demo accounts (na seed):</p>
        <ul className="space-y-1 font-mono text-xs">
          <li>medewerker@dekast.nl / medewerker123 (medewerker)</li>
          <li>admin@dekast.nl / admin123 (admin)</li>
          <li>jan@dekast.nl / lid123 (lid - Onbeperkt + cursus)</li>
          <li>sophie@dekast.nl / lid123 (lid - 1x + cursus)</li>
          <li>piet@dekast.nl / lid123 (lid - 1x zonder cursus, weeklimiet test)</li>
          <li>klaas@dekast.nl / coach123 (coach)</li>
        </ul>
      </div>
      <p className="mt-4 text-sm">
        Nog geen account? <a href="/register" className="underline">Registreren</a>
      </p>
    </div>
  )
}
