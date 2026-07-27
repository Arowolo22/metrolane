import { useLocation } from "react-router-dom"

import { AuthCard } from "@/features/auth/components/AuthCard"
import { AuthHeader } from "@/features/auth/components/AuthHeader"
import { LoginForm } from "@/features/auth/components/LoginForm"

type LoginLocationState = {
  message?: string
}

export function LoginPage() {
  const location = useLocation()
  const state = location.state as LoginLocationState | null

  return (
    <AuthCard>
      <div className="space-y-6">
        <AuthHeader
          title="Welcome Back"
          description="Sign in to continue to the Lecturer Result Management System."
        />
        <LoginForm successMessage={state?.message ?? null} />
      </div>
    </AuthCard>
  )
}
