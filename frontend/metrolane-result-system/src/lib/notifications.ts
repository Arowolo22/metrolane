import { toast } from "sonner"

import { classifyApiError } from "@/lib/apiErrors"

const DEFAULT_DURATION = 4_500

export function notifySuccess(message: string, description?: string): void {
  toast.success(message, { description, duration: DEFAULT_DURATION })
}

export function notifyInfo(message: string, description?: string): void {
  toast.info(message, { description, duration: DEFAULT_DURATION })
}

export function notifyWarning(message: string, description?: string): void {
  toast.warning(message, { description, duration: 6_000 })
}

export function notifyError(error: unknown, fallback = "Something went wrong."): void {
  const normalized = classifyApiError(error, fallback)
  toast.error(normalized.message, {
    description: normalized.kind === "unknown" ? undefined : normalized.errorId,
    duration: 6_000,
  })
}
