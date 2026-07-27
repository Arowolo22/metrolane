import { AuthCard } from "@/features/auth/components/AuthCard"
import { AuthHeader } from "@/features/auth/components/AuthHeader"
import { RegisterForm } from "@/features/auth/components/RegisterForm"

export function RegisterPage() {
  return (
    <AuthCard className="max-w-lg">
      <div className="space-y-6">
        <AuthHeader
          title="Create Staff Account"
          description="Registration is limited to lecturers and authorized academic staff. Student access is not available on this portal."
          badge={
            <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-100">
              Academic staff only
            </span>
          }
        />
        <RegisterForm />
      </div>
    </AuthCard>
  )
}
