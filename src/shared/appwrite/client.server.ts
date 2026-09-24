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
 *
 * Env vars are read lazily, inside these functions, rather than at module
 * load. Reading them at the top level runs as soon as the module is
 * imported, which can happen during client-side bundling analysis — this
 * file must do nothing until one of its functions is actually called.
 */

import { Account, Client, Functions, Users } from 'node-appwrite'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function baseClient() {
  return new Client()
    .setEndpoint(requireEnv('APPWRITE_ENDPOINT'))
    .setProject(requireEnv('APPWRITE_PROJECT_ID'))
}

/** Auth flow only — never use this for calling the Function. */
export function adminClient() {
  const client = baseClient().setKey(requireEnv('APPWRITE_API_KEY'))
  return {
    account: new Account(client),
    users: new Users(client),
  }
}

export function sessionClient(sessionSecret: string) {
  const client = baseClient().setSession(sessionSecret)
  return {
    account: new Account(client),
    functions: new Functions(client),
  }
}

export function functionId() {
  return requireEnv('APPWRITE_FUNCTION_ID')
}
