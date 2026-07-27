export type LoginCredentials = {
  email: string
  password: string
  rememberMe: boolean
}

export type RegisterPayload = {
  firstName: string
  lastName: string
  department: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export type ForgotPasswordPayload = {
  email: string
}

export type ResetPasswordPayload = {
  password: string
  confirmPassword: string
}

/** Placeholder for future API responses */
export type AuthResult = {
  success: boolean
  message?: string
}
