import { useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

import type { AuthUser } from "@/features/auth/types"
import { fetchCurrentUser, logoutRequest } from "@/features/auth/services/authService"
import {
  AUTH_EXPIRED_EVENT,
  clearAuthTokens,
  getAccessToken,
} from "@/lib/api"
import { classifyApiError } from "@/lib/apiErrors"

import { AuthContext, type AuthContextValue } from "./authContextInstance"

const SESSION_NOTICE_KEY = "metrolane.auth.sessionNotice"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<ReturnType<typeof classifyApiError> | null>(null)

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null)
      setAuthError(null)
      setIsLoading(false)
      return
    }

    setAuthError(null)
    try {
      const currentUser = await fetchCurrentUser()
      setUser(currentUser)
    } catch (error) {
      const normalized = classifyApiError(error, "We couldn’t verify your session.")
      if (normalized.kind === "unauthorized") {
        clearAuthTokens()
        sessionStorage.setItem(
          SESSION_NOTICE_KEY,
          "Your session expired. Please sign in again.",
        )
        setUser(null)
      } else {
        setAuthError(normalized)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Auth bootstrap synchronizes browser token state with the provider.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser()
  }, [refreshUser])

  useEffect(() => {
    const handleAuthExpired = () => {
      sessionStorage.setItem(
        SESSION_NOTICE_KEY,
        "Your session expired. Please sign in again.",
      )
      setAuthError(null)
      setUser(null)
      setIsLoading(false)
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      authError,
      isAuthenticated: Boolean(user),
      refreshUser,
      logout,
    }),
    [user, isLoading, authError, refreshUser, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
