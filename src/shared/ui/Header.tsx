import { Link } from '@tanstack/react-router'

import type { CurrentUser } from '#/shared/appwrite/current-user.server'
import { useLogout } from '#/features/session/logout.queries'

export function Header({ user }: { user: CurrentUser }) {
  return (
    <header>
      <nav>
        <Link to="/">HAUZ</Link>

        {user ? (
          <span className="header-actions">
            <Link to="/profile">{user.firstName}</Link>
            <LogoutButton />
          </span>
        ) : (
          <Link to="/login">Sign in</Link>
        )}
      </nav>
    </header>
  )
}

function LogoutButton() {
  const logout = useLogout()

  return (
    <button
      type="button"
      onClick={() => {
        logout.mutate({})
      }}
      disabled={logout.isPending}
    >
      {logout.isPending ? 'Logging out…' : 'Log out'}
    </button>
  )
}
