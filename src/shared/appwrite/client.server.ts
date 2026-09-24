/**
 * Two kinds of Appwrite client, for two different jobs.
 *
 * adminClient — authenticated with the project's API key (.env). Used only
 * for the auth flow itself: creating email tokens and sessions. This is
 * privileged access and must never run anywhere but the server.
 *
 * sessionClient — authenticated as a specific signed-in user, via their
 * session secret. This is what we use to call the `personal-account`
 * Function, because the Function reads the caller's identity from
 * `x-appwrite-user-id`, which Appwrite only sets when the execution itself
 * carries a user session — not when it carries an admin API key.
 */

import { Account, Client, Functions } from 'node-appwrite'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

const ENDPOINT = requireEnv('APPWRITE_ENDPOINT')
const PROJECT_ID = requireEnv('APPWRITE_PROJECT_ID')
const API_KEY = requireEnv('APPWRITE_API_KEY')
export const FUNCTION_ID = requireEnv('APPWRITE_FUNCTION_ID')

function baseClient() {
  return new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID)
}

/** Admin-privileged client. Auth flow only — never for calling the Function. */
export function adminClient() {
  const client = baseClient().setKey(API_KEY)
  return {
    account: new Account(client),
  }
}

export function sessionClient(sessionSecret: string) {
  const client = baseClient().setSession(sessionSecret)
  return {
    account: new Account(client),
    functions: new Functions(client),
  }
}
