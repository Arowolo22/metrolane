import type { LucideIcon } from "lucide-react"
import {
  Ban,
  CloudAlert,
  FileQuestion,
  KeyRound,
  ShieldAlert,
  TriangleAlert,
  WifiOff,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getStatusCopy, ResilienceError, type ApiErrorKind } from "@/lib/apiErrors"
import { cn } from "@/lib/utils"
import { RetryButton } from "@/components/states/RetryButton"

const ERROR_ICONS: Record<ApiErrorKind, LucideIcon> = {
  network: WifiOff,
  server: CloudAlert,
  badRequest: TriangleAlert,
  unauthorized: KeyRound,
  forbidden: ShieldAlert,
  notFound: FileQuestion,
  conflict: TriangleAlert,
  validation: TriangleAlert,
  rateLimited: TriangleAlert,
  unknown: Ban,
}

type ErrorStateProps = {
  error: ResilienceError
  onRetry?: () => void
  onGoHome?: () => void
  onContactSupport?: () => void
  isRetrying?: boolean
  attempt?: number
  maxAttempts?: number
  compact?: boolean
  className?: string
}

export function ErrorState({
  error,
  onRetry,
  onGoHome,
  onContactSupport,
  isRetrying = false,
  attempt,
  maxAttempts,
  compact = false,
  className,
}: ErrorStateProps) {
  const copy = getStatusCopy(error.kind)
  const Icon = ERROR_ICONS[error.kind]

  return (
    <Card
      role="alert"
      className={cn(
        "border-red-200 bg-red-50/70",
        compact ? "shadow-none" : "shadow-sm",
        className,
      )}
    >
      <CardContent className={cn("flex gap-4", compact ? "p-4" : "p-6")}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-xs">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-red-950">{copy.title}</h2>
          <p className="mt-1 text-sm leading-6 text-red-900/80">{copy.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {onRetry && error.retryable ? (
              <RetryButton
                onRetry={onRetry}
                attempt={attempt}
                maxAttempts={maxAttempts}
                isRetrying={isRetrying}
                label={copy.actionLabel ?? "Retry"}
                className="bg-red-600 hover:bg-red-700"
              />
            ) : null}
            {onGoHome ? (
              <Button type="button" size="sm" variant="outline" onClick={onGoHome} className="min-h-10 sm:min-h-8">
                Go home
              </Button>
            ) : null}
            {onContactSupport ? (
              <Button type="button" size="sm" variant="ghost" onClick={onContactSupport} className="min-h-10 sm:min-h-8 text-red-800">
                Contact support
              </Button>
            ) : null}
          </div>
          {error.kind === "unknown" || error.kind === "server" ? (
            <p className="mt-3 font-mono text-[11px] text-red-800/70">Reference: {error.errorId}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function demoError(kind: ApiErrorKind): ResilienceError {
  return new ResilienceError({
    kind,
    message: getStatusCopy(kind).description,
    retryable: kind === "network" || kind === "server" || kind === "rateLimited",
    errorId: "ML-STATE",
  })
}

export function NetworkError(props: Omit<ErrorStateProps, "error">) {
  return <ErrorState {...props} error={demoError("network")} />
}

export function ServerError(props: Omit<ErrorStateProps, "error">) {
  return <ErrorState {...props} error={demoError("server")} />
}

export function NotFound(props: Omit<ErrorStateProps, "error">) {
  return <ErrorState {...props} error={demoError("notFound")} />
}

export function AccessDenied(props: Omit<ErrorStateProps, "error">) {
  return <ErrorState {...props} error={demoError("forbidden")} />
}

export function SessionExpired(props: Omit<ErrorStateProps, "error">) {
  return <ErrorState {...props} error={demoError("unauthorized")} />
}
