import { createFileRoute, redirect } from '@tanstack/react-router'

import { getProfile } from '#/features/profile/profile'
import { ProfileForm } from '#/features/profile/ProfileForm'
import { hasSession } from '#/features/session/require-auth'

export const Route = createFileRoute('/profile')({
  beforeLoad: async () => {
    const signedIn = await hasSession()
    if (!signedIn) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/login',
        search: { redirect: '/profile' },
      })
    }
  },
  loader: () => getProfile(),
  component: ProfilePage,
})

function ProfilePage() {
  const account = Route.useLoaderData()

  return (
    <main>
      <h1>Profile</h1>
      <ProfileForm account={account} />
    </main>
  )
}
