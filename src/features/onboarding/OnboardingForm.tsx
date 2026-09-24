import { useState, type SyntheticEvent } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { useCompleteOnboarding } from './onboarding.queries'
import { PERSONAL_ROLES } from '#/shared/domain/personal-account'

export function OnboardingForm() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/onboarding' })

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState<(typeof PERSONAL_ROLES)[number]>(
    PERSONAL_ROLES[0],
  )

  const complete = useCompleteOnboarding()

  function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault()
    complete.mutate(
      { data: { firstName, lastName, role, redirect: search.redirect } },
      {
        onSuccess: (result) => {
          void navigate({ to: result.redirectTo })
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First name
        <input
          required
          value={firstName}
          onChange={(event) => {
            setFirstName(event.target.value)
          }}
        />
      </label>

      <label>
        Last name
        <input
          required
          value={lastName}
          onChange={(event) => {
            setLastName(event.target.value)
          }}
        />
      </label>

      <label>
        Role
        <select
          value={role}
          onChange={(event) => {
            setRole(event.target.value as (typeof PERSONAL_ROLES)[number])
          }}
        >
          {PERSONAL_ROLES.map((r) => (
            <option key={r} value={r}>
              {r.replace('_', ' ')}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" disabled={complete.isPending}>
        {complete.isPending ? 'Creating…' : 'Continue'}
      </button>

      {complete.isError && <p>{complete.error.message}</p>}
    </form>
  )
}
