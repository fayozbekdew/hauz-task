import { createServerFn } from '@tanstack/react-start'

import { getSessionSecret } from '#/shared/appwrite/session.server'

export const hasSession = createServerFn({ method: 'GET' }).handler(() =>
  Boolean(getSessionSecret()),
)
