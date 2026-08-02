import type { Response, NextFunction } from "express"

import type { AuthenticatedRequest } from "../middleware/auth.js"
import {
  attachResultPdf,
  createResult,
  formatResultDetail,
  formatStudentRecordListItem,
  getResultById,
  listStudentRecords,
  updateResultStatus,
} from "../services/result.service.js"
import { uploadResultPdf } from "../services/upload.service.js"
import { ok } from "../utils/apiResponse.js"
import {
  createResultSchema,
  studentRecordsQuerySchema,
  updateStatusSchema,
} from "../validators/schemas.js"

function getRouteParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value
}

export async function createResultHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = createResultSchema.parse(req.body)
    const result = await createResult(body, req.user!.userId)

    if (body.pdfBase64) {
      try {
        const pdfBuffer = Buffer.from(body.pdfBase64, "base64")
        const pdfUrl = await uploadResultPdf(pdfBuffer, body.filename)
        await attachResultPdf(result.id, pdfUrl)
        result.pdfUrl = pdfUrl
      } catch (uploadError) {
        console.warn("PDF upload skipped:", uploadError)
      }
    }

    res.status(201).json(ok(formatResultDetail(result), "Result saved successfully"))
  } catch (error) {
    next(error)
  }
}

export async function getResultHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await getResultById(getRouteParam(req.params.id))
    res.json(ok(formatResultDetail(result)))
  } catch (error) {
    next(error)
  }
}

export async function listStudentRecordsHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = studentRecordsQuerySchema.parse(req.query)
    const records = await listStudentRecords(query)

    res.json(ok(records.map(formatStudentRecordListItem)))
  } catch (error) {
    next(error)
  }
}

export async function updateResultStatusHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = updateStatusSchema.parse(req.body)
    const result = await updateResultStatus(getRouteParam(req.params.id), body.status)
    res.json(ok(formatResultDetail(result), "Result status updated"))
  } catch (error) {
    next(error)
  }
}
