export type PasswordStrengthLevel = "weak" | "fair" | "good" | "strong"

export type PasswordStrengthResult = {
  level: PasswordStrengthLevel
  score: number
  label: string
  checks: {
    length: boolean
    lowercase: boolean
    uppercase: boolean
    number: boolean
    special: boolean
  }
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }

  const score = Object.values(checks).filter(Boolean).length

  if (score <= 2) {
    return { level: "weak", score, label: "Weak", checks }
  }
  if (score === 3) {
    return { level: "fair", score, label: "Fair", checks }
  }
  if (score === 4) {
    return { level: "good", score, label: "Good", checks }
  }
  return { level: "strong", score, label: "Strong", checks }
}

export const strengthBarColors: Record<PasswordStrengthLevel, string> = {
  weak: "bg-red-500",
  fair: "bg-orange-400",
  good: "bg-orange-500",
  strong: "bg-green-600",
}
