import { useEffect, useState } from "react"

export function useSlowNetwork(isLoading: boolean, delayMs = 1_200): boolean {
  const [isSlow, setIsSlow] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      // Reset the delayed notice before the next request starts.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSlow(false)
      return
    }

    const timer = window.setTimeout(() => setIsSlow(true), delayMs)
    return () => window.clearTimeout(timer)
  }, [delayMs, isLoading])

  return isLoading && isSlow
}
