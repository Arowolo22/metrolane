import { AuthCard } from "@/features/auth/components/AuthCard"
import { AuthHeader } from "@/features/auth/components/AuthHeader"
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm"

export function ResetPasswordPage() {
  return (
    <AuthCard>
      <div className="space-y-6">
        <AuthHeader
          title="Reset Password"
          description="Choose a new password for your lecturer portal account."
        />
        <ResetPasswordForm />
      </div>
    </AuthCard>
  )
}
