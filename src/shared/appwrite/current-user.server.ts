/**
 * The single source of truth for "who is signed in, if anyone."
 *
 * Reads the session cookie and asks the Function for that session's
 * Personal Account — the brief wants the header to show the person's
 * first name, which lives on the Personal Account, not the Appwrite User.
 *
 * Per the brief: if loading the current user fails for any reason, treat
 * the person as signed out and clear the session cookie. The one
 * exception is a 404 from the Function: that means the session is valid
 * but the person hasn't finished onboarding yet, so there's no first name
 * to show — signed out for header purposes, but the cookie stays, since
 * the session itself is fine.
 */

import { sessionClient } from './client.server'
import {
  getPersonalAccount,
  PersonalAccountError,
} from './personal-account.server'
import { clearSessionSecret, getSessionSecret } from './session.server'

export type CurrentUser = {
  firstName: string
} | null

export async function getCurrentUser(): Promise<CurrentUser> {
  const secret = getSessionSecret()
  if (!secret) {
    return null
  }

  try {
    const { functions } = sessionClient(secret)
    const account = await getPersonalAccount(functions)
    return { firstName: account.firstName }
  } catch (error) {
    if (error instanceof PersonalAccountError && error.status === 404) {
      return null
    }

    clearSessionSecret()
    return null
  }
}
