import { createServerFn } from '@tanstack/react-start'

import { sessionClient } from '#/shared/appwrite/client.server'
import {
  clearSessionSecret,
  getSessionSecret,
} from '#/shared/appwrite/session.server'

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const secret = getSessionSecret()

  if (secret) {
    try {
      const { account } = sessionClient(secret)
      await account.deleteSession({ sessionId: 'current' })
    } catch {
      // Session may already be invalid/expired on Appwrite's side — that's
      // fine, we're clearing our own cookie regardless.
    }
  }

  clearSessionSecret()
})
