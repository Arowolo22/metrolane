import { Navigate, Outlet, useLocation } from "react-router-dom"

import { ErrorState, SkeletonLoader } from "@/components/states"
import { useAuth } from "@/features/auth/context/useAuth"

const SESSION_NOTICE_KEY = "metrolane.auth.sessionNotice"

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, authError, refreshUser } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
        <div className="mx-auto max-w-5xl">
          <SkeletonLoader variant="navigation" rows={4} className="mb-8 max-w-xs" />
          <SkeletonLoader variant="card" rows={3} />
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
        <div className="mx-auto max-w-2xl">
          <ErrorState error={authError} onRetry={() => void refreshUser()} />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    const message = sessionStorage.getItem(SESSION_NOTICE_KEY)
    if (message) sessionStorage.removeItem(SESSION_NOTICE_KEY)

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, message }}
      />
    )
  }

  return <Outlet />
}
