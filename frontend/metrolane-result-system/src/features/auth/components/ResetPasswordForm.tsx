import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/features/auth/components/PasswordInput"
import { PasswordStrength } from "@/features/auth/components/PasswordStrength"
import { resetPasswordRequest } from "@/features/auth/services/authService"
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/utils/validation"

export function ResetPasswordForm() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const password = watch("password")

  useEffect(() => {
    if (!completed) {
      return
    }
    const timer = window.setTimeout(() => {
      navigate("/login", { replace: true })
    }, 2500)
    return () => window.clearTimeout(timer)
  }, [completed, navigate])

  async function onSubmit(values: ResetPasswordFormValues) {
    setSubmitError(null)
    try {
      const result = await resetPasswordRequest(values)
      if (!result.success) {
        setSubmitError(
          result.message ?? "Unable to reset password. Please try again.",
        )
        return
      }
      setCompleted(true)
    } catch {
      setSubmitError("Something went wrong. Please try again.")
    }
  }

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </div>
        <Alert variant="success" className="text-left">
          <AlertDescription className="font-medium">
            Password Updated Successfully
          </AlertDescription>
        </Alert>
        <p className="text-sm text-gray-500">Redirecting you to sign in…</p>
        <Button asChild variant="outline" className="w-full">
          <Link to="/login">Return to Login</Link>
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {submitError ? (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          placeholder="Enter new password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-xs text-red-500" role="alert">
            {errors.password.message}
          </p>
        ) : null}
        <PasswordStrength password={password} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-confirm-password">Confirm Password</Label>
        <PasswordInput
          id="reset-confirm-password"
          autoComplete="new-password"
          placeholder="Confirm new password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="text-xs text-red-500" role="alert">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Updating…
          </>
        ) : (
          "Reset Password"
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
