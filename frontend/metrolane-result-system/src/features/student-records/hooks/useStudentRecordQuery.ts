import { useQuery } from "@tanstack/react-query"

import { fetchResultById } from "@/features/student-records/services/studentRecordsService"
import { classifyApiError, type ResilienceError } from "@/lib/apiErrors"

export const studentRecordQueryKey = (id: string | undefined) => [
  "student-record",
  id,
] as const

export function useStudentRecordQuery(id: string | undefined) {
  return useQuery({
    queryKey: studentRecordQueryKey(id),
    queryFn: async () => {
      if (!id) throw new Error("A result id is required")
      try {
        return await fetchResultById(id)
      } catch (error) {
        throw classifyApiError(error, "Failed to load result.")
      }
    },
    enabled: Boolean(id),
  }) as ReturnType<typeof useQuery<Awaited<ReturnType<typeof fetchResultById>>, ResilienceError>>
}
