import { AuthCard } from "@/features/auth/components/AuthCard"
import { AuthHeader } from "@/features/auth/components/AuthHeader"
import { RegisterForm } from "@/features/auth/components/RegisterForm"

export function RegisterPage() {
  return (
    <AuthCard className="max-w-lg">
      <div className="space-y-6">
        <AuthHeader
          title="Create Administrator Account"
          description="Create an administrator account to manage the Metrolane result system."
          badge={
            <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-100">
              Administrator access
            </span>
          }
        />
        <RegisterForm />
      </div>
    </AuthCard>
  )
}
