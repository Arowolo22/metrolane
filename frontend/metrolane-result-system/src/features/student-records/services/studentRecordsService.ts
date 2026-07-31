import type { ResultStatus, StudentRecord } from "@/features/student-records/types"
import { apiClient, getApiErrorMessage, type ApiEnvelope } from "@/lib/api"

export type StudentRecordsFilters = {
  status?: ResultStatus
  department?: string
  search?: string
}

export async function fetchStudentRecords(
  filters: StudentRecordsFilters = {},
): Promise<StudentRecord[]> {
  try {
    const { data } = await apiClient.get<ApiEnvelope<StudentRecord[]>>(
      "/student-records",
      { params: filters },
    )

    if (!data.success || !data.data) {
      throw new Error(data.message ?? "Failed to load student records")
    }

    return data.data
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to load student records."),
    )
  }
}

export async function updateResultStatus(
  id: string,
  status: ResultStatus,
): Promise<StudentRecord> {
  try {
    const { data } = await apiClient.patch<ApiEnvelope<StudentRecord>>(
      `/results/${id}/status`,
      { status },
    )

    if (!data.success || !data.data) {
      throw new Error(data.message ?? "Failed to update status")
    }

    return data.data as StudentRecord
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to update status."))
  }
}

export async function fetchResultById(id: string) {
  try {
    const { data } = await apiClient.get<ApiEnvelope<StudentRecord>>(
      `/results/${id}`,
    )

    if (!data.success || !data.data) {
      throw new Error(data.message ?? "Result not found")
    }

    return data.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to load result."))
  }
}
