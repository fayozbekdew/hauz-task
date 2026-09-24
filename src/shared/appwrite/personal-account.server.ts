/**
 * One place that knows how to call the `personal-account` Function and how
 * to turn its responses into typed values or typed errors. Every feature
 * that needs the Function (auth's post-login check, onboarding, profile)
 * goes through here instead of talking to `functions.createExecution`
 * directly, so the response shape and error handling can't drift apart.
 */

import { ExecutionMethod } from 'node-appwrite'
import type { Functions } from 'node-appwrite'

import { functionId } from './client.server'
import type {
  PersonalAccountRole,
  PersonalAccount,
} from '../domain/personal-account'

type ErrorBody = {
  error: string
  message: string
  issues?: { field: string; message: string }[]
}

export class PersonalAccountError extends Error {
  status: number
  code: string
  issues?: { field: string; message: string }[]

  constructor(status: number, body: ErrorBody) {
    super(body.message)
    this.name = 'PersonalAccountError'
    this.status = status
    this.code = body.error
    this.issues = body.issues
  }
}

async function callFunction(
  functions: Functions,
  method: ExecutionMethod,
  body?: unknown,
): Promise<PersonalAccount> {
  const execution = await functions.createExecution({
    functionId: functionId(),
    xpath: '/personal-account',
    method,
    body: body ? JSON.stringify(body) : undefined,
  })

  const status = execution.responseStatusCode
  const parsed: unknown = execution.responseBody
    ? JSON.parse(execution.responseBody)
    : null

  if (status >= 200 && status < 300) {
    return parsed as PersonalAccount
  }

  throw new PersonalAccountError(status, parsed as ErrorBody)
}

export function getPersonalAccount(functions: Functions) {
  return callFunction(functions, ExecutionMethod.GET)
}

export function createPersonalAccount(
  functions: Functions,
  body: { firstName: string; lastName: string; role: PersonalAccountRole },
) {
  return callFunction(functions, ExecutionMethod.POST, body)
}

export function updatePersonalAccount(
  functions: Functions,
  body: Partial<{
    firstName: string
    lastName: string
    contactEmail: string | null
    bio: string | null
  }>,
) {
  return callFunction(functions, ExecutionMethod.PATCH, body)
}
