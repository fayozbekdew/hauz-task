/**
 * Reading, writing and clearing the session cookie.
 *
 * The cookie holds the Appwrite session *secret* — the same string
 * `account.createSession()` returns. It must be httpOnly so client-side JS
 * can never read it, which is the whole point: the browser proves who the
 * user is by sending the cookie, not by holding the secret itself.
 */

import {
  getCookie,
  setCookie,
  deleteCookie,
} from '@tanstack/react-start/server'

const COOKIE_NAME = 'hauz_session'

export function getSessionSecret(): string | undefined {
  return getCookie(COOKIE_NAME)
}

export function setSessionSecret(secret: string, expiresAt: string) {
  setCookie(COOKIE_NAME, secret, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiresAt),
  })
}

export function clearSessionSecret() {
  deleteCookie(COOKIE_NAME, { path: '/' })
}
