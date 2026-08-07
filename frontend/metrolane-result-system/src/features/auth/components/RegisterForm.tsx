import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/features/auth/components/PasswordInput"
import { PasswordStrength } from "@/features/auth/components/PasswordStrength"
import { registerRequest } from "@/features/auth/services/authService"
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/utils/validation"

export function RegisterForm() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = useWatch({ control, name: "password" })

  async function onSubmit(values: RegisterFormValues) {
    setSubmitError(null)
    try {
      const result = await registerRequest(values)
      if (!result.success) {
        setSubmitError(
          result.message ?? "Unable to create account. Please try again.",
        )
        return
      }
      navigate("/login", {
        replace: true,
        state: {
          message: "Administrator account created successfully. Please sign in.",
        },
      })
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            autoComplete="given-name"
            placeholder="First name"
            aria-invalid={Boolean(errors.firstName)}
            {...register("firstName")}
          />
          {errors.firstName ? (
            <p className="text-xs text-red-500" role="alert">
              {errors.firstName.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            autoComplete="family-name"
            placeholder="Last name"
            aria-invalid={Boolean(errors.lastName)}
            {...register("lastName")}
          />
          {errors.lastName ? (
            <p className="text-xs text-red-500" role="alert">
              {errors.lastName.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">Email Address</Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="admin@metrolane.edu.ng"
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
        <Label htmlFor="register-password">Password</Label>
        <PasswordInput
          id="register-password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-xs text-red-500" role="alert">
            {errors.password.message}
          </p>
        ) : null}
        <p className="text-xs text-orange-600">
         Administrator passwords must be included.
        </p>
        <PasswordStrength password={password} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Confirm your password"
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
            Creating account…
          </>
        ) : (
          "Create Administrator Account"
        )}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="rounded-sm font-medium text-orange-500 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          Sign In
        </Link>
      </p>
    </form>
  )
}
