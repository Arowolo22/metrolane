import { cn } from "@/lib/utils"
import {
  evaluatePasswordStrength,
  strengthBarColors,
} from "@/features/auth/utils/passwordStrength"

type PasswordStrengthProps = {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  if (!password) {
    return null
  }

  const { level, label, score, checks } = evaluatePasswordStrength(password)

  return (
    <div className={cn("space-y-2", className)} aria-live="polite">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-gray-600">Password strength</span>
        <span className="text-xs font-medium text-gray-700">{label}</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((segment) => (
          <div
            key={segment}
            className={cn(
              "h-1.5 flex-1 rounded-full bg-gray-200 transition-colors duration-300",
              segment <= score && strengthBarColors[level],
            )}
          />
        ))}
      </div>
      <ul className="grid grid-cols-1 gap-1 text-xs text-gray-500 sm:grid-cols-2">
        <li className={checks.length ? "text-green-700" : undefined}>
          At least 8 characters
        </li>
        <li className={checks.uppercase ? "text-green-700" : undefined}>
          Uppercase letter
        </li>
        <li className={checks.lowercase ? "text-green-700" : undefined}>
          Lowercase letter
        </li>
        <li className={checks.number ? "text-green-700" : undefined}>
          Number
        </li>
        <li className={checks.special ? "text-green-700" : undefined}>
          Special character
        </li>
      </ul>
    </div>
  )
}
