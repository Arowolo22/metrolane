import { User } from "lucide-react"

export function StudentPhotoPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-32 w-28 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
        <User className="h-12 w-12 text-gray-300" strokeWidth={1.5} />
      </div>
      <p className="text-center text-xs text-gray-400">Passport Photograph</p>
    </div>
  )
}
