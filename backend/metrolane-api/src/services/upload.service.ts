import { supabaseAdmin } from "../config/supabase.js"
import { AppError } from "../middleware/errorHandler.js"

const STUDENT_PHOTOS_BUCKET = "student-photos"
const RESULT_PDFS_BUCKET = "result-pdfs"

function extensionFromMimeType(mimeType: string): string {
  const subtype = mimeType.split("/")[1]?.split("+")[0]
  return subtype && /^[a-z0-9]+$/i.test(subtype) ? subtype : "jpg"
}

export async function uploadStudentPhoto(
  buffer: Buffer,
  matricNumber: string,
  mimeType: string,
): Promise<string> {
  const extension = extensionFromMimeType(mimeType)
  const path = `${matricNumber.replace(/\s+/g, "_")}_${Date.now()}.${extension}`

  const { error } = await supabaseAdmin.storage
    .from(STUDENT_PHOTOS_BUCKET)
    .upload(path, buffer, { contentType: mimeType, upsert: true })

  if (error) {
    throw new AppError(`Failed to upload photo: ${error.message}`, 500)
  }

  const { data } = supabaseAdmin.storage.from(STUDENT_PHOTOS_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadResultPdf(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const path = `${filename.replace(/\.pdf$/i, "")}.pdf`

  const { error } = await supabaseAdmin.storage
    .from(RESULT_PDFS_BUCKET)
    .upload(path, buffer, { contentType: "application/pdf", upsert: true })

  if (error) {
    throw new AppError(`Failed to upload PDF: ${error.message}`, 500)
  }

  const { data } = supabaseAdmin.storage.from(RESULT_PDFS_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
