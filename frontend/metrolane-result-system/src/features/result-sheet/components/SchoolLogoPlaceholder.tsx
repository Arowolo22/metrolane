import { Building2 } from "lucide-react"

export function SchoolLogoPlaceholder() {
  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
      <Building2 className="h-8 w-8 text-gray-300" strokeWidth={1.5} />
      <span className="sr-only">Official School Logo</span>
    </div>
  )
}
