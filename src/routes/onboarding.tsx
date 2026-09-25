import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { hasSession } from '#/features/session/require-auth'

import { OnboardingForm } from '#/features/onboarding/OnboardingForm'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/onboarding')({
  validateSearch: searchSchema,
  beforeLoad: async () => {
    const signedIn = await hasSession()
    if (!signedIn) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/login',
        search: { redirect: '/onboarding' },
      })
    }
  },
  component: OnboardingPage,
})

function OnboardingPage() {
  return (
    <main>
      <h1>Tell us about yourself</h1>
      <OnboardingForm />
    </main>
  )
}
