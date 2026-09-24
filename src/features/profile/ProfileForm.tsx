import { useState, type SyntheticEvent } from 'react'

import { useUpdateProfile } from './profile.queries'
import type { PersonalAccount } from '#/shared/domain/personal-account'

type FieldState = {
  firstName: string
  lastName: string
  contactEmail: string
  bio: string
}

function toFieldState(account: PersonalAccount): FieldState {
  return {
    firstName: account.firstName,
    lastName: account.lastName,
    contactEmail: account.contactEmail ?? '',
    bio: account.bio ?? '',
  }
}

/**
 * Builds the PATCH body from what actually changed, following the
 * Function's contract: omit a field to leave it untouched, send null to
 * clear it. A field left blank in the form means "clear it" only if it
 * had a value before — never sends "" itself, since the Function rejects
 * empty strings outright.
 */
function diffToPatch(initial: FieldState, current: FieldState) {
  const patch: Record<string, string | null> = {}

  if (current.firstName !== initial.firstName) {
    patch.firstName = current.firstName
  }
  if (current.lastName !== initial.lastName) {
    patch.lastName = current.lastName
  }
  if (current.contactEmail !== initial.contactEmail) {
    patch.contactEmail =
      current.contactEmail.trim() === '' ? null : current.contactEmail
  }
  if (current.bio !== initial.bio) {
    patch.bio = current.bio.trim() === '' ? null : current.bio
  }

  return patch
}

export function ProfileForm({ account }: { account: PersonalAccount }) {
  const initial = toFieldState(account)
  const [fields, setFields] = useState<FieldState>(initial)

  const update = useUpdateProfile()

  function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault()

    const patch = diffToPatch(initial, fields)
    if (Object.keys(patch).length === 0) {
      return
    }

    update.mutate({ data: patch })
  }

  const hasChanges = Object.keys(diffToPatch(initial, fields)).length > 0

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First name
        <input
          required
          value={fields.firstName}
          onChange={(event) => {
            setFields((f) => ({ ...f, firstName: event.target.value }))
          }}
        />
      </label>

      <label>
        Last name
        <input
          required
          value={fields.lastName}
          onChange={(event) => {
            setFields((f) => ({ ...f, lastName: event.target.value }))
          }}
        />
      </label>

      <label>
        Role
        <input value={account.role} disabled />
      </label>

      <label>
        Contact email
        <input
          type="email"
          value={fields.contactEmail}
          onChange={(event) => {
            setFields((f) => ({ ...f, contactEmail: event.target.value }))
          }}
        />
      </label>

      <label>
        Bio
        <textarea
          value={fields.bio}
          onChange={(event) => {
            setFields((f) => ({ ...f, bio: event.target.value }))
          }}
        />
      </label>

      <button type="submit" disabled={update.isPending || !hasChanges}>
        {update.isPending ? 'Saving…' : 'Save'}
      </button>

      {update.isError && <p>{update.error.message}</p>}
      {update.isSuccess && <p>Saved.</p>}
    </form>
  )
}
