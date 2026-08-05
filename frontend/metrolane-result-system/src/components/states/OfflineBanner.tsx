import { WifiOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"

type OfflineBannerProps = {
  onRetry?: () => void
  forceOffline?: boolean
}

export function OfflineBanner({ onRetry, forceOffline = false }: OfflineBannerProps) {
  const isOnline = useOnlineStatus()
  if (isOnline && !forceOffline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-amber-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center">
        <WifiOff className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
        <p className="flex-1 text-sm">
          <strong className="font-semibold">You’re offline.</strong>{" "}
          Changes stay safe on this device and will sync when your connection returns.
        </p>
        {onRetry ? (
          <Button type="button" variant="outline" size="sm" onClick={onRetry} className="min-h-10 sm:min-h-8">
            Retry connection
          </Button>
        ) : null}
      </div>
    </div>
  )
}
