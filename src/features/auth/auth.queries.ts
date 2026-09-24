import { useMutation } from '@tanstack/react-query'

import { confirmEmailCode, requestEmailCode } from './auth'

export function useRequestEmailCode() {
  return useMutation({ mutationFn: requestEmailCode })
}

export function useConfirmEmailCode() {
  return useMutation({ mutationFn: confirmEmailCode })
}
