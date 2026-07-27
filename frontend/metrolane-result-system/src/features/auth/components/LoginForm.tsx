import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/features/auth/components/PasswordInput"
import { loginRequest } from "@/features/auth/services/authService"
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/utils/validation"

type LoginFormProps = {
  successMessage?: string | null
}

export function LoginForm({ successMessage }: LoginFormProps) {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null)
    try {
      const result = await loginRequest(values)
      if (!result.success) {
        setSubmitError(result.message ?? "Unable to sign in. Please try again.")
        return
      }
      navigate("/calculator", { replace: true })
    } catch {
      setSubmitError("Something went wrong. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {successMessage ? (
        <Alert variant="success">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}

      {submitError ? (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
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

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-xs text-red-500" role="alert">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
          <Checkbox
            id="rememberMe"
            aria-describedby="rememberMe-hint"
            {...register("rememberMe")}
          />
          <span>Remember me</span>
        </label>
        <p id="rememberMe-hint" className="sr-only">
          Preference only; session persistence will be handled by the backend.
        </p>
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-orange-500 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-sm"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Signing in…
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-orange-500 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-sm"
        >
          Sign Up
        </Link>
      </p>
    </form>
  )
}
