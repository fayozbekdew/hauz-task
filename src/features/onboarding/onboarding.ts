import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { sessionClient } from '#/shared/appwrite/client.server'
import { getSessionSecret } from '#/shared/appwrite/session.server'
import { PERSONAL_ROLES } from '#/shared/domain/personal-account'
import { createPersonalAccount } from '#/shared/appwrite/personal-account.server'

const createProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  role: z.enum(PERSONAL_ROLES),
  redirect: z.string().optional(),
})

/**
 * Creating the Personal Account. The Function itself is idempotent — a
 * repeat call with the same role returns 200, not a second row — so a
 * double-click here is handled server-side, not just by disabling the
 * button.
 */
export const completeOnboarding = createServerFn({ method: 'POST' })
  .validator(createProfileSchema)
  .handler(async ({ data }) => {
    const secret = getSessionSecret()
    if (!secret) {
      throw new Error('Not signed in.')
    }

    const { functions } = sessionClient(secret)

    await createPersonalAccount(functions, {
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    })

    return { redirectTo: data.redirect ?? '/' }
  })
