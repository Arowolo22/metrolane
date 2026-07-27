import { AuthCard } from "@/features/auth/components/AuthCard"
import { AuthHeader } from "@/features/auth/components/AuthHeader"
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm"

export function ForgotPasswordPage() {
  return (
    <AuthCard>
      <div className="space-y-6">
        <AuthHeader
          title="Forgot Password"
          description="Enter your registered email address and we'll send you instructions to reset your password."
        />
        <ForgotPasswordForm />
      </div>
    </AuthCard>
  )
}
