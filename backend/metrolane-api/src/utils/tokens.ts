import jwt, { type SignOptions } from "jsonwebtoken"

import { env } from "../config/env.js"

export type TokenPayload = {
  userId: string
  email: string
}

const accessTokenOptions: SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
}

const refreshTokenOptions: SignOptions = {
  expiresIn: `${env.REFRESH_TOKEN_EXPIRES_IN_DAYS}d` as SignOptions["expiresIn"],
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, accessTokenOptions)
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, refreshTokenOptions)
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload
}

export function generateResetToken(): string {
  return crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "")
}
