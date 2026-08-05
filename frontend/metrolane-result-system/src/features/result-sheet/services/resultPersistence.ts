import type { SaveResultRecordPayload } from "@/features/result-sheet/types"
import { apiClient, type ApiEnvelope } from "@/lib/api"
import { ResilienceError } from "@/lib/apiErrors"

export type SavedResultResponse = {
  id: string
  summary: {
    semesterGpa: number
    cumulativeGpa: number | null
    degreeClassification: string
    academicStanding: string
  }
}

export async function persistGeneratedResult(
  payload: SaveResultRecordPayload,
): Promise<SavedResultResponse> {
  const { data } = await apiClient.post<ApiEnvelope<SavedResultResponse>>(
    "/results",
    payload,
  )

  if (!data.success || !data.data) {
    throw new ResilienceError({
      kind: "unknown",
      message: data.message ?? "Failed to save result to the server.",
      retryable: true,
    })
  }

  return data.data
}
