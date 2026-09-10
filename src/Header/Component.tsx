import { getCurrentUser } from '@/utilities/getCurrentUser'
import { SiteNavigation } from '@/components/kast/Navigation'
export async function Header() {
  const user = await getCurrentUser()
  return <SiteNavigation signedIn={Boolean(user)} staff={user?.role === 'medewerker' || user?.role === 'admin'} />
}
