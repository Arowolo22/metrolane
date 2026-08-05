import { QueryClient } from "@tanstack/react-query"

import { classifyApiError } from "@/lib/apiErrors"

const MAX_AUTOMATIC_RETRIES = 2

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        const normalized = classifyApiError(error)
        return normalized.retryable && failureCount < MAX_AUTOMATIC_RETRIES
      },
      retryDelay: (attemptIndex) => Math.min(1_000 * 2 ** attemptIndex, 8_000),
    },
    mutations: {
      retry: (failureCount, error) => {
        const normalized = classifyApiError(error)
        return normalized.retryable && failureCount < 1
      },
      retryDelay: 1_500,
    },
  },
})
