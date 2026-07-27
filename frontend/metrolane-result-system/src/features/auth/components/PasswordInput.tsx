import { Eye, EyeOff } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type PasswordInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type"
> & {
  id: string
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, id, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative">
      <Input
        id={id}
        ref={ref}
        type={visible ? "text" : "password"}
        autoComplete={props.autoComplete ?? "current-password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-10 w-10 text-gray-500 hover:text-gray-700"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOff className="h-4 w-4" aria-hidden />
        ) : (
          <Eye className="h-4 w-4" aria-hidden />
        )}
      </Button>
    </div>
  )
})
PasswordInput.displayName = "PasswordInput"
