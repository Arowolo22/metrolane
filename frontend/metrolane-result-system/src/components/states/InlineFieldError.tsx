import { CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"

type InlineFieldErrorProps = {
  id?: string
  message?: string
  className?: string
}

export function InlineFieldError({
  id,
  message,
  className,
}: InlineFieldErrorProps) {
  if (!message) return null

  return (
    <p
      id={id}
      role="alert"
      className={cn("flex items-center gap-1 text-xs text-red-700", className)}
    >
      <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  )
}
