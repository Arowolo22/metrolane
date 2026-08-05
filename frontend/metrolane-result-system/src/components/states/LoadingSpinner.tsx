import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

type LoadingSpinnerProps = {
  label?: string
  className?: string
}

export function LoadingSpinner({
  label = "Loading",
  className,
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center gap-2 text-sm text-gray-500", className)}
    >
      <Loader2 className="h-4 w-4 animate-spin text-orange-500" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  )
}
