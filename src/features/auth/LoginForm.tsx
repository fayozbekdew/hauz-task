import { useState, type SyntheticEvent } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { useConfirmEmailCode, useRequestEmailCode } from './auth.queries'

export function LoginForm() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/login' })

  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [code, setCode] = useState('')

  const requestCode = useRequestEmailCode()
  const confirmCode = useConfirmEmailCode()

  function handleRequestCode(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault()
    requestCode.mutate(
      { data: { email } },
      {
        onSuccess: (result) => {
          setUserId(result.userId)
          setStep('code')
        },
      },
    )
  }

  function handleConfirmCode(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault()
    confirmCode.mutate(
      { data: { userId, secret: code, redirect: search.redirect } },
      {
        onSuccess: (result) => {
          void navigate({ to: result.redirectTo })
        },
      },
    )
  }

  if (step === 'email') {
    return (
      <form onSubmit={handleRequestCode}>
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
            }}
          />
        </label>
        <button type="submit" disabled={requestCode.isPending}>
          {requestCode.isPending ? 'Sending…' : 'Send code'}
        </button>
        {requestCode.isError && <p>{requestCode.error.message}</p>}
      </form>
    )
  }

  return (
    <form onSubmit={handleConfirmCode}>
      <label>
        Code
        <input
          required
          value={code}
          onChange={(event) => {
            setCode(event.target.value)
          }}
        />
      </label>
      <button type="submit" disabled={confirmCode.isPending}>
        {confirmCode.isPending ? 'Signing in…' : 'Continue'}
      </button>
      {confirmCode.isError && <p>{confirmCode.error.message}</p>}
    </form>
  )
}
