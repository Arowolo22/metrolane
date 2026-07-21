import { cn } from "@/lib/utils"
import type { ResultStatus } from "../types"

interface StatusBadgeProps {
  status: ResultStatus
  className?: string
}

const statusConfig: Record<ResultStatus, { label: string; className: string }> = {
  Generated: {
    label: "Generated",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  Approved: {
    label: "Approved",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  Pending: {
    label: "Pending",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  Rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
