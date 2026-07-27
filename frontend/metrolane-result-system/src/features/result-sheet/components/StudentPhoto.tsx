import { User } from "lucide-react"

export function StudentPhoto() {
  return (
    <div className="flex h-28 w-24 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-50">
      <User className="h-10 w-10 text-gray-300" strokeWidth={1.5} />
      <span className="mt-1 text-center text-[10px] text-gray-400">
        Passport Photo
      </span>
    </div>
  )
}
