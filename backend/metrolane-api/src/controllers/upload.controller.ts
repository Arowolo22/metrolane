import type { Response, NextFunction } from "express"

import type { AuthenticatedRequest } from "../middleware/auth.js"
import { uploadStudentPhoto } from "../services/upload.service.js"
import { AppError } from "../middleware/errorHandler.js"
import { ok } from "../utils/apiResponse.js"
import { uploadStudentPhotoSchema } from "../validators/schemas.js"

const MAX_PHOTO_BYTES = 5 * 1024 * 1024

export async function uploadStudentPhotoHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = uploadStudentPhotoSchema.parse(req.body)
    const buffer = Buffer.from(body.photoBase64, "base64")

    if (buffer.length > MAX_PHOTO_BYTES) {
      throw new AppError("Photo must be 5MB or smaller", 400)
    }

    const url = await uploadStudentPhoto(buffer, body.matricNumber, body.mimeType)
    res.status(201).json(ok({ url }, "Photo uploaded successfully"))
  } catch (error) {
    next(error)
  }
}
