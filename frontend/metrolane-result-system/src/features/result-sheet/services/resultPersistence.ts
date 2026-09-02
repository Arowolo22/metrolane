import type { SaveResultRecordPayload } from "@/features/result-sheet/types"
import type { BackendResultSummary } from "@/features/result-sheet/utils/resultHelpers"
import { apiClient, type ApiEnvelope } from "@/lib/api"
import { ResilienceError } from "@/lib/apiErrors"

export type SavedResultResponse = {
  id: string
  summary: BackendResultSummary
}

export async function persistGeneratedResult(
  payload: SaveResultRecordPayload,
): Promise<SavedResultResponse> {
  const { data } = await apiClient.post<
    ApiEnvelope<{ id: string; summary: BackendResultSummary }>
  >("/results", payload)

  if (!data.success || !data.data) {
    throw new ResilienceError({
      kind: "unknown",
      message: data.message ?? "Failed to save result to the server.",
      retryable: true,
    })
  }

  return {
    id: data.data.id,
    summary: data.data.summary,
  }
}
