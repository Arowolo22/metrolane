import { Loader2, Upload, User } from "lucide-react"
import { useRef, useState, type ChangeEvent } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import type { StudentInformationFormValues } from "@/features/calculator/utils/validation"
import { uploadStudentPhoto } from "@/features/calculator/services/photoUploadService"

const MAX_PHOTO_BYTES = 5 * 1024 * 1024

export function StudentPhotoUpload() {
  const { watch, setValue } = useFormContext<StudentInformationFormValues>()
  const photoUrl = watch("photoUrl")
  const matricNumber = watch("matricNumber")
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.")
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error("Photo must be 5MB or smaller.")
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadStudentPhoto(file, matricNumber ?? "")
      setValue("photoUrl", url, { shouldValidate: true })
      toast.success("Passport photo uploaded.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload photo.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="flex h-32 w-28 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isUploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
        ) : photoUrl ? (
          <img
            src={photoUrl}
            alt="Student passport"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <Upload className="h-7 w-7" strokeWidth={1.5} />
            <User className="h-6 w-6" strokeWidth={1.5} />
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <p className="text-center text-xs text-gray-400">
        {photoUrl ? "Click photo to change" : "Click to upload passport photograph"}
      </p>
    </div>
  )
}
