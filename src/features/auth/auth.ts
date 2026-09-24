import { ID, Query } from 'node-appwrite'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { adminClient, sessionClient } from '#/shared/appwrite/client.server'
import { setSessionSecret } from '#/shared/appwrite/session.server'
import {
  getPersonalAccount,
  PersonalAccountError,
} from '#/shared/appwrite/personal-account.server'

const requestCodeSchema = z.object({
  email: z.email(),
})

async function findUserIdByEmail(email: string): Promise<string | null> {
  const { users } = adminClient()
  const result = await users.list({
    queries: [Query.equal('email', email), Query.limit(1)],
  })
  return result.users[0]?.$id ?? null
}

/** Step 1: send a code to the given email. Same flow for new and returning users. */

export const requestEmailCode = createServerFn({ method: 'POST' })
  .validator(requestCodeSchema)
  .handler(async ({ data }) => {
    const { account } = adminClient()
    const userId = (await findUserIdByEmail(data.email)) ?? ID.unique()
    await account.createEmailToken({ userId, email: data.email })
    return { userId }
  })

const confirmCodeSchema = z.object({
  userId: z.string().min(1),
  secret: z.string().min(1),
  redirect: z.string().optional(),
})

/**
 * Step 2: exchange the code for a session, store it, then decide where the
 * person goes next — onboarding if they have no Personal Account yet,
 * otherwise wherever `redirect` points.
 */
export const confirmEmailCode = createServerFn({ method: 'POST' })
  .validator(confirmCodeSchema)
  .handler(async ({ data }) => {
    const { account } = adminClient()
    const session = await account.createSession({
      userId: data.userId,
      secret: data.secret,
    })

    setSessionSecret(session.secret, session.expire)

    const { functions } = sessionClient(session.secret)

    try {
      await getPersonalAccount(functions)
      return { redirectTo: data.redirect ?? '/' }
    } catch (error) {
      if (error instanceof PersonalAccountError && error.status === 404) {
        const search = data.redirect
          ? `?redirect=${encodeURIComponent(data.redirect)}`
          : ''
        return { redirectTo: `/onboarding${search}` }
      }
      throw error
    }
  })
