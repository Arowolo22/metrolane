import { useState } from "react"
import {
  CheckCircle2,
  CloudAlert,
  FileQuestion,
  Inbox,
  ShieldAlert,
  WifiOff,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AccessDenied,
  EmptyState,
  ErrorState,
  OfflineBanner,
  SessionExpired,
  SkeletonLoader,
  SlowNetworkNotice,
} from "@/components/states"
import { notifyError, notifyInfo, notifySuccess, notifyWarning } from "@/lib/notifications"
import { ResilienceError } from "@/lib/apiErrors"

const demoServerError = new ResilienceError({
  kind: "server",
  status: 503,
  message: "Service unavailable",
  errorId: "ML-DEMO-503",
})

export function StateLibraryShowcasePage() {
  const [forceOffline, setForceOffline] = useState(false)
  const [isSlowLoading, setIsSlowLoading] = useState(true)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-600">
            State library showcase
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
            Resilient states, ready to reuse.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            These primitives keep loading, empty, recovery, validation, and feedback states understandable across the result workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setForceOffline((value) => !value)}>
            <WifiOff aria-hidden="true" />
            {forceOffline ? "Restore online preview" : "Preview offline"}
          </Button>
          <Button type="button" onClick={() => notifySuccess("Draft saved", "Your changes are safe.")}>
            <CheckCircle2 aria-hidden="true" />
            Test success toast
          </Button>
        </div>
      </div>

      <OfflineBanner forceOffline={forceOffline} onRetry={() => setForceOffline(false)} />

      <section aria-labelledby="loading-states" className="space-y-3">
        <div>
          <h2 id="loading-states" className="text-lg font-semibold text-gray-900">Loading states</h2>
          <p className="mt-1 text-sm text-gray-500">Skeleton geometry mirrors the final surface to prevent layout shift.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Table skeleton</CardTitle>
              <CardDescription>Records keep their column rhythm while data is fetched.</CardDescription>
            </CardHeader>
            <CardContent>
              <SkeletonLoader variant="table" rows={4} />
              <SlowNetworkNotice isLoading={isSlowLoading} className="mt-4 border-blue-200 bg-blue-50 text-blue-900" />
              <Button type="button" variant="ghost" size="sm" className="mt-3" onClick={() => setIsSlowLoading((value) => !value)}>
                {isSlowLoading ? "Resolve slow request" : "Preview slow request"}
              </Button>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Dashboard cards</CardTitle></CardHeader>
              <CardContent><SkeletonLoader variant="card" rows={2} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Profile and form</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <SkeletonLoader variant="profile" />
                <SkeletonLoader variant="form" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section aria-labelledby="empty-states" className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle id="empty-states">Empty state</CardTitle>
            <CardDescription>Explain what is missing and make the next action obvious.</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Inbox}
              title="No saved views yet"
              description="Create a view to return to your favorite filters faster."
              actionLabel="Create view"
              onAction={() => notifyInfo("Create view", "This action is ready to connect to your saved-view flow.")}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Search no-results</CardTitle>
            <CardDescription>Empty results can reset filters without losing context.</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={FileQuestion}
              title="No students found"
              description="Try a different name or matric number, or clear the search."
              actionLabel="Clear search"
              onAction={() => notifyInfo("Search cleared")}
              className="min-h-48"
            />
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="recovery-states" className="space-y-3">
        <div>
          <h2 id="recovery-states" className="text-lg font-semibold text-gray-900">Recoverable errors</h2>
          <p className="mt-1 text-sm text-gray-500">Transient failures explain impact, preserve context, and offer a bounded retry.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ErrorState
            error={demoServerError}
            attempt={2}
            maxAttempts={3}
            onRetry={() => notifyWarning("Retry queued", "The next attempt will use exponential backoff.")}
            onContactSupport={() => notifyInfo("Support contact", "Include reference ML-DEMO-503 in your report.")}
          />
          <div className="space-y-4">
            <AccessDenied onGoHome={() => notifyInfo("Return to records")} />
            <SessionExpired onRetry={() => notifyWarning("Sign-in required", "Your session needs to be restored.")} />
          </div>
        </div>
      </section>

      <section aria-labelledby="feedback-states" className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle id="feedback-states">Toast feedback</CardTitle>
            <CardDescription>Each message is dismissible, time-bounded, and announced accessibly.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => notifySuccess("Export ready", "Your result sheet is ready to download.")}>Success</Button>
            <Button type="button" variant="outline" onClick={() => notifyInfo("Sync paused", "We’ll retry automatically when online.")}>Information</Button>
            <Button type="button" variant="outline" onClick={() => notifyWarning("Review required", "Enter a matric number before generating.")}>Warning</Button>
            <Button type="button" variant="outline" onClick={() => notifyError(new ResilienceError({ kind: "server", status: 503, message: "Service unavailable" }))}>Error</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accessibility contract</CardTitle>
            <CardDescription>States never rely on color alone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p className="flex gap-2"><ShieldAlert className="h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />Visible text accompanies every icon and semantic tone.</p>
            <p className="flex gap-2"><CloudAlert className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />Dynamic messages use polite or assertive live regions based on severity.</p>
            <p className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />Actions retain keyboard focus rings and mobile-friendly tap targets.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
