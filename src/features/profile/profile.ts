import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { sessionClient } from '#/shared/appwrite/client.server'
import {
  getPersonalAccount,
  updatePersonalAccount,
} from '#/shared/appwrite/personal-account.server'
import { getSessionSecret } from '#/shared/appwrite/session.server'

export const getProfile = createServerFn({ method: 'GET' }).handler(
  async () => {
    const secret = getSessionSecret()
    if (!secret) {
      throw new Error('Not signed in.')
    }
    const { functions } = sessionClient(secret)
    return getPersonalAccount(functions)
  },
)

const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  contactEmail: z.email().max(254).nullable().optional(),
  bio: z.string().trim().min(1).max(2000).nullable().optional(),
})

export const updateProfile = createServerFn({ method: 'POST' })
  .validator(updateProfileSchema)
  .handler(async ({ data }) => {
    const secret = getSessionSecret()
    if (!secret) {
      throw new Error('Not signed in.')
    }
    const { functions } = sessionClient(secret)
    return updatePersonalAccount(functions, data)
  })
