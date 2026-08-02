import { useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

import type { AuthUser } from "@/features/auth/types"
import { fetchCurrentUser, logoutRequest } from "@/features/auth/services/authService"
import { getAccessToken } from "@/lib/api"

import { AuthContext, type AuthContextValue } from "./authContextInstance"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null)
      setIsLoading(false)
      return
    }

    const currentUser = await fetchCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Fetching the current session on mount is the standard React data-fetching
    // pattern; the resulting loading/user state is only known once this resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser()
  }, [refreshUser])

  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      refreshUser,
      logout,
    }),
    [user, isLoading, refreshUser, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
