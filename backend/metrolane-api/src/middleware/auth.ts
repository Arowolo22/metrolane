import type { Request, Response, NextFunction } from "express"

import { AppError } from "./errorHandler.js"
import { verifyAccessToken } from "../utils/tokens.js"

export type AuthenticatedRequest = Request & {
  user?: {
    userId: string
    email: string
  }
}

export function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    next(new AppError("Authentication required", 401))
    return
  }

  const token = header.slice(7)
  try {
    const payload = verifyAccessToken(token)
    req.user = payload
    next()
  } catch {
    next(new AppError("Invalid or expired token", 401))
  }
}

export function optionalAuthenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    next()
    return
  }

  try {
    req.user = verifyAccessToken(header.slice(7))
  } catch {
    // ignore invalid token for optional auth
  }
  next()
}
