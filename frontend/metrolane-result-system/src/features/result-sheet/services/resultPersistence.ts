import type { SaveResultRecordPayload } from "@/features/result-sheet/types"
import { apiClient, getApiErrorMessage, type ApiEnvelope } from "@/lib/api"

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
  try {
    const { data } = await apiClient.post<
      ApiEnvelope<SavedResultResponse>
    >("/results", payload)

    if (!data.success || !data.data) {
      throw new Error(data.message ?? "Failed to save result")
    }

    return data.data
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to save result to the server."),
    )
  }
}
