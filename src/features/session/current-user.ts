import { createServerFn } from '@tanstack/react-start'

import { getCurrentUser as getCurrentUserImpl } from '#/shared/appwrite/current-user.server'

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(() =>
  getCurrentUserImpl(),
)
