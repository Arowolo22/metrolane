import { z } from "zod"

const emailSchema = z
  .string()
  .min(1, "Email address is required")
  .email("Enter a valid email address")

export const passwordRulesSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Include at least one lowercase letter")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number")
  .regex(/[^A-Za-z0-9]/, "Include at least one special character")

/**
 * Administrator accounts must type "metrolane" plus at least one other
 * letter as part of their real password before they can be authenticated.
 */
export function hasMetrolanePepper(password: string): boolean {
  const match = password.match(/metrolane/i)
  if (!match || match.index === undefined) return false

  const remainder =
    password.slice(0, match.index) + password.slice(match.index + match[0].length)
  return /[a-zA-Z]/.test(remainder)
}

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: emailSchema,
    password: passwordRulesSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => hasMetrolanePepper(data.password), {
    message:
      'Administrator passwords must include "metrolane" plus at least one additional letter',
    path: ["password"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    password: passwordRulesSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
