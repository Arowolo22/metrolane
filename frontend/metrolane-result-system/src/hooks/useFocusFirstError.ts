import { useEffect } from "react"
import type { FieldErrors } from "react-hook-form"

function findFirstErrorPath(value: unknown, prefix = ""): string | null {
  if (!value || typeof value !== "object") return null

  for (const [key, nestedValue] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (
      nestedValue &&
      typeof nestedValue === "object" &&
      "message" in nestedValue &&
      typeof nestedValue.message === "string"
    ) {
      return path
    }

    const nestedPath = findFirstErrorPath(nestedValue, path)
    if (nestedPath) return nestedPath
  }

  return null
}

export function useFocusFirstError(
  errors: FieldErrors,
  shouldFocus: boolean,
): void {
  useEffect(() => {
    if (!shouldFocus) return
    const firstErrorPath = findFirstErrorPath(errors)
    if (!firstErrorPath) return

    const target =
      document.getElementsByName(firstErrorPath)[0] ??
      document.getElementById(firstErrorPath)
    if (target instanceof HTMLElement) {
      target.focus({ preventScroll: false })
    }
  }, [errors, shouldFocus])
}
