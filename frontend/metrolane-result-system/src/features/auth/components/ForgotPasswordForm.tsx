import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordRequest } from "@/features/auth/services/authService"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/utils/validation"

export function ForgotPasswordForm() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordFormValues) {
    setSubmitError(null)
    try {
      const result = await forgotPasswordRequest(values)
      if (!result.success) {
        setSubmitError(
          result.message ?? "Unable to send reset link. Please try again.",
        )
        return
      }
      navigate("/forgot-password/success", { replace: true })
    } catch {
      setSubmitError("Something went wrong. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {submitError ? (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="forgot-email">Email Address</Label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          placeholder="lecturer@metrolane.edu.ng"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-xs text-red-500" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>

      <p className="text-center text-sm text-gray-500">
        <Link
          to="/login"
          className="font-medium text-orange-500 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-sm"
        >
          Return to Login
        </Link>
      </p>
    </form>
  )
}
