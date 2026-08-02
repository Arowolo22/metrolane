import { getCache } from "../config/redis.js"
import { env } from "../config/env.js"
import {
  createUser,
  findUserByEmail,
  findUserById,
  hashPassword,
  updateUserPasswordHash,
  verifyPassword,
  type IUser,
  type UserRole,
} from "../models/User.js"
import { AppError } from "../middleware/errorHandler.js"
import { hasMetrolanePepper } from "../utils/adminPassword.js"
import {
  generateResetToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js"

const REFRESH_PREFIX = "refresh:"
const RESET_PREFIX = "reset:"

export type AuthUserResponse = {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string
  phone: string
  role: string
}

export type LoginResponse = {
  user: AuthUserResponse
  accessToken: string
  refreshToken?: string
}

function toAuthUser(user: IUser): AuthUserResponse {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    department: user.department,
    phone: user.phone,
    role: user.role,
  }
}

export async function registerUser(input: {
  firstName: string
  lastName: string
  department: string
  email: string
  phone: string
  password: string
  role?: UserRole
}): Promise<AuthUserResponse> {
  const existing = await findUserByEmail(input.email)
  if (existing) {
    throw new AppError("An account with this email already exists", 409)
  }

  if (input.role === "admin" && !hasMetrolanePepper(input.password)) {
    throw new AppError(
      'Administrator passwords must include "metrolane" plus at least one additional letter',
      400,
    )
  }

  const passwordHash = await hashPassword(input.password)
  const user = await createUser({
    ...input,
    passwordHash,
  })

  return toAuthUser(user)
}

export async function loginUser(input: {
  email: string
  password: string
  rememberMe: boolean
}): Promise<LoginResponse> {
  const user = await findUserByEmail(input.email)

  if (!user || !(await verifyPassword(user.passwordHash, input.password))) {
    throw new AppError("Invalid email or password", 401)
  }

  if (!user.isActive) {
    throw new AppError("Your account has been deactivated", 403)
  }

  const payload = { userId: user.id, email: user.email }
  const accessToken = signAccessToken(payload)
  const response: LoginResponse = {
    user: toAuthUser(user),
    accessToken,
  }

  if (input.rememberMe) {
    const refreshToken = signRefreshToken(payload)
    const cache = getCache()
    await cache.set(
      `${REFRESH_PREFIX}${refreshToken}`,
      user.id,
      "EX",
      env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60,
    )
    response.refreshToken = refreshToken
  }

  return response
}

export async function getUserById(userId: string): Promise<AuthUserResponse> {
  const user = await findUserById(userId)
  if (!user) {
    throw new AppError("User not found", 404)
  }
  return toAuthUser(user)
}

export async function logoutUser(refreshToken?: string): Promise<void> {
  if (!refreshToken) return
  const cache = getCache()
  await cache.del(`${REFRESH_PREFIX}${refreshToken}`)
}

export async function refreshSession(refreshToken: string): Promise<LoginResponse> {
  const cache = getCache()
  const storedUserId = await cache.get(`${REFRESH_PREFIX}${refreshToken}`)
  if (!storedUserId) {
    throw new AppError("Invalid refresh token", 401)
  }

  let payload
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    await cache.del(`${REFRESH_PREFIX}${refreshToken}`)
    throw new AppError("Invalid refresh token", 401)
  }

  if (payload.userId !== storedUserId) {
    throw new AppError("Invalid refresh token", 401)
  }

  const user = await findUserById(storedUserId)
  if (!user || !user.isActive) {
    throw new AppError("User not found", 404)
  }

  const newPayload = { userId: user.id, email: user.email }
  const accessToken = signAccessToken(newPayload)
  const newRefreshToken = signRefreshToken(newPayload)

  await cache.del(`${REFRESH_PREFIX}${refreshToken}`)
  await cache.set(
    `${REFRESH_PREFIX}${newRefreshToken}`,
    user.id,
    "EX",
    env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60,
  )

  return {
    user: toAuthUser(user),
    accessToken,
    refreshToken: newRefreshToken,
  }
}

export async function requestPasswordReset(email: string): Promise<{ resetLink?: string }> {
  const user = await findUserByEmail(email)
  if (!user) {
    // Do not reveal whether email exists
    return {}
  }

  const token = generateResetToken()
  const cache = getCache()
  await cache.set(
    `${RESET_PREFIX}${token}`,
    user.id,
    "EX",
    env.PASSWORD_RESET_EXPIRES_MINUTES * 60,
  )

  const resetLink = `${env.FRONTEND_URL}/reset-password?token=${token}`

  if (env.NODE_ENV === "development") {
    console.log(`Password reset link for ${email}: ${resetLink}`)
  }

  return { resetLink: env.NODE_ENV === "development" ? resetLink : undefined }
}

export async function resetPassword(input: {
  token: string
  password: string
}): Promise<void> {
  const cache = getCache()
  const userId = await cache.get(`${RESET_PREFIX}${input.token}`)
  if (!userId) {
    throw new AppError("Invalid or expired reset token", 400)
  }

  const user = await findUserById(userId)
  if (!user) {
    throw new AppError("User not found", 404)
  }

  if (user.role === "admin" && !hasMetrolanePepper(input.password)) {
    throw new AppError(
      'Administrator passwords must include "metrolane" plus at least one additional letter',
      400,
    )
  }

  const passwordHash = await hashPassword(input.password)
  await updateUserPasswordHash(user.id, passwordHash)
  await cache.del(`${RESET_PREFIX}${input.token}`)
}
