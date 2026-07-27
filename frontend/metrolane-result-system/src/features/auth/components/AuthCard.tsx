import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type AuthCardProps = {
  children: ReactNode
  className?: string
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg shadow-gray-200/50 sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  )
}
