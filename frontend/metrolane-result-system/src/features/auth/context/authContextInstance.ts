import { createContext } from "react"

import type { AuthUser } from "@/features/auth/types"
import type { ResilienceError } from "@/lib/apiErrors"

export type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  authError: ResilienceError | null
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
