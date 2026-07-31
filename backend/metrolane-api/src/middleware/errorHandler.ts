import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"

import { fail } from "../utils/apiResponse.js"

export class AppError extends Error {
  statusCode: number
  errors?: Record<string, string[]>

  constructor(
    message: string,
    statusCode = 400,
    errors?: Record<string, string[]>,
  ) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
  }
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json(fail("Resource not found"))
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(fail(err.message, err.errors))
    return
  }

  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {}
    for (const issue of err.issues) {
      const path = issue.path.join(".") || "form"
      errors[path] = errors[path] ?? []
      errors[path].push(issue.message)
    }
    res.status(400).json(fail("Validation failed", errors))
    return
  }

  console.error(err)
  res.status(500).json(fail("Internal server error"))
}
