import { apiClient, getApiErrorMessage, type ApiEnvelope } from "@/lib/api"

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(",")[1] ?? "")
    }
    reader.onerror = () => reject(new Error("Failed to read the selected file."))
    reader.readAsDataURL(file)
  })
}

export async function uploadStudentPhoto(
  file: File,
  matricNumber: string,
): Promise<string> {
  const photoBase64 = await fileToBase64(file)

  try {
    const { data } = await apiClient.post<ApiEnvelope<{ url: string }>>(
      "/upload/student-photo",
      {
        photoBase64,
        mimeType: file.type,
        matricNumber: matricNumber.trim() || "student",
      },
    )

    if (!data.success || !data.data) {
      throw new Error(data.message ?? "Failed to upload photo")
    }

    return data.data.url
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to upload photo."), { cause: error })
  }
}
