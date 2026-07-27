import type { SaveResultRecordPayload } from "@/features/result-sheet/types"

export async function persistGeneratedResult(
  _payload: SaveResultRecordPayload,
): Promise<void> {
  // Reserved for future backend integration:
  // POST /api/results, create student record, update CGPA, etc.
  return Promise.resolve()
}
