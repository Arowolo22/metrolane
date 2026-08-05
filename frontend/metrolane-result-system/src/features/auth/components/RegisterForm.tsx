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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PasswordInput } from "@/features/auth/components/PasswordInput"
import { PasswordStrength } from "@/features/auth/components/PasswordStrength"
import { registerRequest } from "@/features/auth/services/authService"
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/utils/validation"

const departmentOptions = [
  "Community Health",
  "Medical Laboratory Science",
  "Health Information Management",
  "Public Health",
  "Environmental Health",
  "Nursing Sciences",
  "Pharmaceutical Technology",
  "Academic Registry",
] as const

export function RegisterForm() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      department: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      role: "lecturer",
    },
  })

  const password = watch("password")
  const department = watch("department")
  const role = watch("role")
  const isAdmin = role === "admin"

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
          message: "Account created successfully. Please sign in.",
        },
      })
    } catch {
      setSubmitError("Something went wrong. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
        <Label htmlFor="department">Department</Label>
        <Select
          value={department || undefined}
          onValueChange={(value) =>
            setValue("department", value, { shouldValidate: true })
          }
        >
          <SelectTrigger id="department" aria-invalid={Boolean(errors.department)}>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departmentOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.department ? (
          <p className="text-xs text-red-500" role="alert">
            {errors.department.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">Email Address</Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="staff@metrolane.edu.ng"
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
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+234 800 000 0000"
          aria-invalid={Boolean(errors.phone)}
          {...register("phone")}
        />
        {errors.phone ? (
          <p className="text-xs text-red-500" role="alert">
            {errors.phone.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-600">
          <Checkbox
            id="isAdmin"
            className="mt-0.5"
            checked={isAdmin}
            onCheckedChange={(checked) =>
              setValue("role", checked === true ? "admin" : "lecturer", {
                shouldValidate: true,
              })
            }
          />
          <span>
            Register as a <span className="font-medium text-gray-800">System Administrator</span>{" "}
            instead of a lecturer.
          </span>
        </label>
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
        {isAdmin ? (
          <p className="text-xs text-orange-600">
            
          </p>
        ) : null}
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

      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-2 text-sm text-gray-600">
          <Checkbox
            id="acceptTerms"
            className="mt-0.5"
            aria-invalid={Boolean(errors.acceptTerms)}
            {...register("acceptTerms")}
          />
           <span>
            I confirm that I am a lecturer or authorized academic staff member
            and I agree to the{" "}
            <span className="font-medium text-gray-800">
              Terms and Conditions
            </span>{" "}
            of the Lecturer Result Management System.
          </span>
        </label> 
        {errors.acceptTerms ? (
          <p className="text-xs text-red-500" role="alert">
            {errors.acceptTerms.message}
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
          "Create Account"
        )}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-orange-500 transition-colors hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-sm"
        >
          Sign In
        </Link>
      </p>
    </form>
  )
}
