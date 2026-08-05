import { Fragment } from "react"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type SkeletonVariant =
  | "card"
  | "table"
  | "list"
  | "profile"
  | "form"
  | "image"
  | "navigation"

type SkeletonLoaderProps = {
  variant?: SkeletonVariant
  rows?: number
  className?: string
}

const shimmerClass = "state-shimmer bg-gray-200"

export function SkeletonLoader({
  variant = "card",
  rows = 5,
  className,
}: SkeletonLoaderProps) {
  const label = `Loading ${variant}`

  if (variant === "table") {
    return (
      <div role="status" aria-busy="true" aria-label={label} className={cn("w-full", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableHead key={`head-${index}`}>
                  <Skeleton className={cn("h-3 w-20", shimmerClass)} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {Array.from({ length: 5 }).map((__, cellIndex) => (
                  <TableCell key={`cell-${rowIndex}-${cellIndex}`}>
                    <Skeleton className={cn("h-4 w-full max-w-32", shimmerClass)} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <span className="sr-only">Please wait while records load.</span>
      </div>
    )
  }

  if (variant === "list") {
    return (
      <div role="status" aria-busy="true" aria-label={label} className={cn("space-y-3", className)}>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={`list-${index}`} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
            <Skeleton className={cn("h-10 w-10 shrink-0 rounded-full", shimmerClass)} />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className={cn("h-3 w-2/5", shimmerClass)} />
              <Skeleton className={cn("h-3 w-3/5", shimmerClass)} />
            </div>
            <Skeleton className={cn("h-6 w-16 rounded-full", shimmerClass)} />
          </div>
        ))}
      </div>
    )
  }

  if (variant === "profile") {
    return (
      <Card role="status" aria-busy="true" aria-label={label} className={cn("p-6", className)}>
        <div className="flex items-center gap-4">
          <Skeleton className={cn("h-16 w-16 rounded-full", shimmerClass)} />
          <div className="flex-1 space-y-2">
            <Skeleton className={cn("h-4 w-2/5", shimmerClass)} />
            <Skeleton className={cn("h-3 w-3/5", shimmerClass)} />
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`profile-${index}`} className={cn("h-12 rounded-lg", shimmerClass)} />
          ))}
        </div>
      </Card>
    )
  }

  if (variant === "form") {
    return (
      <Card role="status" aria-busy="true" aria-label={label} className={cn("p-6", className)}>
        <Skeleton className={cn("h-5 w-40", shimmerClass)} />
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`form-${index}`} className={cn(index === 0 && "sm:col-span-2", "space-y-2")}>
              <Skeleton className={cn("h-3 w-24", shimmerClass)} />
              <Skeleton className={cn("h-10 w-full rounded-lg", shimmerClass)} />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (variant === "image") {
    return (
      <Skeleton role="status" aria-label={label} className={cn("aspect-video w-full rounded-xl", shimmerClass, className)} />
    )
  }

  if (variant === "navigation") {
    return (
      <div role="status" aria-busy="true" aria-label={label} className={cn("space-y-2", className)}>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={`nav-${index}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <Skeleton className={cn("h-5 w-5 rounded-md", shimmerClass)} />
            <Skeleton className={cn("h-3 w-28", shimmerClass)} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div role="status" aria-busy="true" aria-label={label} className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <Fragment key={`card-${index}`}>
          <Card className="space-y-4 p-5">
            <Skeleton className={cn("h-4 w-1/2", shimmerClass)} />
            <Skeleton className={cn("h-8 w-2/5", shimmerClass)} />
            <Skeleton className={cn("h-3 w-3/5", shimmerClass)} />
          </Card>
        </Fragment>
      ))}
    </div>
  )
}
