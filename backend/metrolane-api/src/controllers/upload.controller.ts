import type { Response, NextFunction } from "express"
import multer from "multer"

import type { AuthenticatedRequest } from "../middleware/auth.js"
import { uploadStudentPhoto } from "../services/upload.service.js"
import { AppError } from "../middleware/errorHandler.js"
import { ok } from "../utils/apiResponse.js"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      cb(new AppError("Only image files are allowed", 400))
      return
    }
    cb(null, true)
  },
})

export const studentPhotoUpload = upload.single("photo")

export async function uploadStudentPhotoHandler(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.file) {
      throw new AppError("Photo file is required", 400)
    }

    const matricNumber =
      typeof req.body.matricNumber === "string" ? req.body.matricNumber : "student"

    const url = await uploadStudentPhoto(req.file.buffer, matricNumber)
    res.status(201).json(ok({ url }, "Photo uploaded successfully"))
  } catch (error) {
    next(error)
  }
}
