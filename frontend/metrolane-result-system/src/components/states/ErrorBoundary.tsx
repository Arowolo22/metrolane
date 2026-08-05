import type { ErrorInfo, ReactNode } from "react"
import { Component } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { House, RefreshCw, TriangleAlert } from "lucide-react"

type ErrorBoundaryProps = {
  children: ReactNode
  className?: string
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void
}

type ErrorBoundaryState = {
  error: Error | null
  errorId: string | null
}

function createErrorId(): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8).toUpperCase()
      : Math.random().toString(36).slice(2, 10).toUpperCase()
  return `ML-${suffix}`
}

export function GlobalErrorFallback({
  errorId,
  onReload,
  onGoHome,
  className,
}: {
  errorId: string
  onReload?: () => void
  onGoHome?: () => void
  className?: string
}) {
  return (
    <div className={cn("flex min-h-[60vh] items-center justify-center p-6", className)}>
      <Card role="alert" className="w-full max-w-2xl border-red-200 bg-red-50/60">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-xs">
            <TriangleAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-700">Unexpected error</p>
            <h1 className="mt-1 text-xl font-semibold text-red-950">We hit an unexpected snag</h1>
            <p className="mt-2 text-sm leading-6 text-red-900/80">
              Your work is safe. Reload the page or return home while we investigate.
            </p>
            <p className="mt-3 font-mono text-xs text-red-800/80">Error ID: {errorId}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button type="button" variant="destructive" onClick={onReload ?? (() => window.location.reload())}>
                <RefreshCw aria-hidden="true" />
                Reload page
              </Button>
              <Button type="button" variant="outline" onClick={onGoHome ?? (() => window.location.assign("/"))}>
                <House aria-hidden="true" />
                Go home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, errorId: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, errorId: createErrorId() }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.state.errorId ?? createErrorId()
    console.error(`[${errorId}] Unhandled application error`, error, errorInfo)
    this.props.onError?.(error, errorInfo, errorId)
  }

  render() {
    if (!this.state.error || !this.state.errorId) return this.props.children

    return (
      <GlobalErrorFallback
        errorId={this.state.errorId}
        className={this.props.className}
      />
    )
  }
}
