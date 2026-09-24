import { useMutation } from '@tanstack/react-query'

import { completeOnboarding } from './onboarding'

export function useCompleteOnboarding() {
  return useMutation({ mutationFn: completeOnboarding })
}
