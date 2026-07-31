import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js"
import { AppError } from "../middleware/errorHandler.js"

export async function uploadStudentPhoto(
  buffer: Buffer,
  matricNumber: string,
): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new AppError("Cloudinary is not configured", 503)
  }

  const publicId = `metrolane/students/${matricNumber.replace(/\s+/g, "_")}_${Date.now()}`

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "metrolane/students",
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(new AppError("Failed to upload photo", 500))
          return
        }
        resolve(result.secure_url)
      },
    )
    stream.end(buffer)
  })
}

export async function uploadResultPdf(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new AppError("Cloudinary is not configured", 503)
  }

  const publicId = `metrolane/results/${filename.replace(/\.pdf$/i, "")}`

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "metrolane/results",
        public_id: publicId,
        resource_type: "raw",
        format: "pdf",
      },
      (error, result) => {
        if (error || !result) {
          reject(new AppError("Failed to upload PDF", 500))
          return
        }
        resolve(result.secure_url)
      },
    )
    stream.end(buffer)
  })
}
