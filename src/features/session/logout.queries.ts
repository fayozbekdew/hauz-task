import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'

import { logout } from './logout'

export function useLogout() {
  const navigate = useNavigate()
  const router = useRouter()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Root loader (getCurrentUser) needs to re-run so the header updates.
      void router.invalidate()
      void navigate({ to: '/' })
    },
  })
}
