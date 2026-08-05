import { Clock3 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSlowNetwork } from "@/hooks/useSlowNetwork"

type SlowNetworkNoticeProps = {
  isLoading: boolean
  delayMs?: number
  className?: string
}

export function SlowNetworkNotice({
  isLoading,
  delayMs,
  className,
}: SlowNetworkNoticeProps) {
  const isSlow = useSlowNetwork(isLoading, delayMs)
  if (!isSlow) return null

  return (
    <Alert
      role="status"
      aria-live="polite"
      className={className ?? "border-blue-200 bg-blue-50 text-blue-900"}
    >
      <Clock3 className="h-4 w-4" aria-hidden="true" />
      <AlertDescription>
        This is taking a little longer than usual. We’ll keep your layout in place while we wait.
      </AlertDescription>
    </Alert>
  )
}
