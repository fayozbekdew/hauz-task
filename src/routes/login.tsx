import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { LoginForm } from '#/features/auth/LoginForm'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: searchSchema,
  component: LoginPage,
})

function LoginPage() {
  return (
    <main>
      <h1>Sign in</h1>
      <LoginForm />
    </main>
  )
}
