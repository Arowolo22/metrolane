import { Loader2, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type RetryButtonProps = {
  onRetry: () => void
  attempt?: number
  maxAttempts?: number
  isRetrying?: boolean
  label?: string
  className?: string
}

export function RetryButton({
  onRetry,
  attempt,
  maxAttempts,
  isRetrying = false,
  label = "Try again",
  className,
}: RetryButtonProps) {
  const retryLabel =
    attempt !== undefined && maxAttempts !== undefined
      ? `${label} · ${attempt}/${maxAttempts}`
      : label

  return (
    <Button
      type="button"
      size="sm"
      onClick={onRetry}
      disabled={isRetrying}
      className={cn("min-h-10 sm:min-h-8", className)}
    >
      {isRetrying ? (
        <Loader2 className="animate-spin" aria-hidden="true" />
      ) : (
        <RotateCw aria-hidden="true" />
      )}
      {isRetrying ? "Retrying…" : retryLabel}
    </Button>
  )
}
