export type LoginCredentials = {
  email: string
  password: string
  rememberMe: boolean
}

export type RegisterPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export type ForgotPasswordPayload = {
  email: string
}

export type ResetPasswordPayload = {
  token: string
  password: string
  confirmPassword: string
}

export type AuthUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string
  phone: string
  role: string
}

export type AuthSession = {
  user: AuthUser
  accessToken: string
  refreshToken?: string
}

export type AuthResult = {
  success: boolean
  message?: string
  user?: AuthUser
}
