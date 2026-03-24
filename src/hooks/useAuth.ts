import { useMemo } from 'react'

import { useAppSelector } from '@/store/hooks'

export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth)

  return useMemo(
    () => ({
      isAuthenticated: auth.isAuthenticated,
      user: auth.user,
    }),
    [auth.isAuthenticated, auth.user],
  )
}
