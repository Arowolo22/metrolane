import type { Response, NextFunction } from "express"

import type { AuthenticatedRequest } from "../middleware/auth.js"
import {
  getUserById,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "../services/auth.service.js"
import { ok } from "../utils/apiResponse.js"
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/schemas.js"

export async function register(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = registerSchema.parse(req.body)
    const user = await registerUser(body)
    res.status(201).json(
      ok(user, "Account created successfully."),
    )
  } catch (error) {
    next(error)
  }
}

export async function login(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = loginSchema.parse(req.body)
    const session = await loginUser(body)
    res.json(ok(session))
  } catch (error) {
    next(error)
  }
}

export async function me(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await getUserById(req.user!.userId)
    res.json(ok(user))
  } catch (error) {
    next(error)
  }
}

export async function logout(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const refreshToken =
      typeof req.body?.refreshToken === "string" ? req.body.refreshToken : undefined
    await logoutUser(refreshToken)
    res.json(ok(null, "Logged out successfully"))
  } catch (error) {
    next(error)
  }
}

export async function refresh(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = refreshTokenSchema.parse(req.body)
    const session = await refreshSession(body.refreshToken)
    res.json(ok(session))
  } catch (error) {
    next(error)
  }
}

export async function forgotPassword(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = forgotPasswordSchema.parse(req.body)
    const result = await requestPasswordReset(body.email)
    res.json(
      ok(
        result,
        "If an account exists for this email, password reset instructions have been sent.",
      ),
    )
  } catch (error) {
    next(error)
  }
}

export async function resetPasswordHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = resetPasswordSchema.parse(req.body)
    await resetPassword(body)
    res.json(ok(null, "Password updated successfully."))
  } catch (error) {
    next(error)
  }
}
