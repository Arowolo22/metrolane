import { useQuery } from "@tanstack/react-query"

import {
  fetchStudentRecords,
  type StudentRecordsFilters,
} from "@/features/student-records/services/studentRecordsService"
import { classifyApiError, type ResilienceError } from "@/lib/apiErrors"

export const studentRecordsQueryKey = (filters: StudentRecordsFilters) => [
  "student-records",
  {
    search: filters.search?.trim() || undefined,
    status: filters.status,
    department: filters.department,
  },
] as const

export function useStudentRecordsQuery(
  filters: StudentRecordsFilters,
  options?: { enabled?: boolean },
) {
  const normalizedFilters: StudentRecordsFilters = {
    search: filters.search?.trim() || undefined,
    status: filters.status,
    department: filters.department,
  }

  return useQuery({
    queryKey: studentRecordsQueryKey(normalizedFilters),
    queryFn: async () => {
      try {
        return await fetchStudentRecords(normalizedFilters)
      } catch (error) {
        throw classifyApiError(error, "Failed to load student records.")
      }
    },
    enabled: options?.enabled ?? true,
  }) as ReturnType<typeof useQuery<Awaited<ReturnType<typeof fetchStudentRecords>>, ResilienceError>>
}
