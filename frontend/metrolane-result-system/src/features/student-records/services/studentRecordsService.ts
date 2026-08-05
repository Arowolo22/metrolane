import type {
  ResultDetail,
  ResultStatus,
  StudentRecord,
} from "@/features/student-records/types"
import type { SaveResultRecordPayload } from "@/features/result-sheet/types"
import { apiClient, type ApiEnvelope } from "@/lib/api"
import { ResilienceError } from "@/lib/apiErrors"

export type StudentRecordsFilters = {
  status?: ResultStatus
  department?: string
  search?: string
}

function throwEnvelopeError<T>(data: ApiEnvelope<T>, fallback: string): never {
  throw new ResilienceError({
    kind: "unknown",
    message: data.message ?? fallback,
    retryable: true,
  })
}

export async function fetchStudentRecords(
  filters: StudentRecordsFilters = {},
): Promise<StudentRecord[]> {
  const { data } = await apiClient.get<ApiEnvelope<StudentRecord[]>>(
    "/student-records",
    { params: filters },
  )

  if (!data.success || !data.data) {
    return throwEnvelopeError(data, "Failed to load student records.")
  }

  return data.data
}

export async function updateResultStatus(
  id: string,
  status: ResultStatus,
): Promise<ResultDetail> {
  const { data } = await apiClient.patch<ApiEnvelope<ResultDetail>>(
    `/results/${id}/status`,
    { status },
  )

  if (!data.success || !data.data) {
    return throwEnvelopeError(data, "Failed to update status.")
  }

  return data.data
}

export async function updateResultRecord(
  id: string,
  payload: SaveResultRecordPayload,
): Promise<ResultDetail> {
  const { data } = await apiClient.put<ApiEnvelope<ResultDetail>>(
    `/results/${id}`,
    payload,
  )

  if (!data.success || !data.data) {
    return throwEnvelopeError(data, "Failed to update result.")
  }

  return data.data
}

export async function fetchResultById(id: string): Promise<ResultDetail> {
  const { data } = await apiClient.get<ApiEnvelope<ResultDetail>>(
    `/results/${id}`,
  )

  if (!data.success || !data.data) {
    return throwEnvelopeError(data, "Failed to load result.")
  }

  return data.data
}
