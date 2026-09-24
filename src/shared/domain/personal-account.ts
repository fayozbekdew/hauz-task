/**
 * Plain domain constants and types for the Personal Account — no Appwrite
 * SDK imports here, so both server (.server.ts) files and client
 * components can import this safely without pulling server-only code
 * (and its function-valued exports) into the client bundle.
 */

export const PERSONAL_ROLES = ['property_owner', 'realtor'] as const
export type PersonalAccountRole = (typeof PERSONAL_ROLES)[number]

export type PersonalAccount = {
  personalAccountId: string
  firstName: string
  lastName: string
  role: PersonalAccountRole
  contactEmail: string | null
  bio: string | null
  createdAt: string
  updatedAt: string
}
