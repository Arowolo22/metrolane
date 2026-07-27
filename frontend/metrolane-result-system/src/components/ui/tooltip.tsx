import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="group/tooltip relative inline-flex">{children}</div>
}

function TooltipTrigger({
  asChild,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp {...props}>{children}</Comp>
  )
}

function TooltipContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tooltip"
      className={cn(
        "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-md transition-opacity group-hover/tooltip:opacity-100",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
