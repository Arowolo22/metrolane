import { SchoolLogoPlaceholder } from "./SchoolLogoPlaceholder"
import { StudentPhoto } from "./StudentPhoto"

interface InstitutionHeaderProps {
  photoUrl?: string
}

export function InstitutionHeader({ photoUrl }: InstitutionHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-6 border-b border-gray-200 pb-6">
      <div className="flex items-start gap-4">
        <SchoolLogoPlaceholder />
        <div>
          <h1 className="text-lg font-bold text-orange-500 sm:text-xl">
            METROLANE College of Health Sciences and Technology
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-700">
            Official Semester Result
          </p>
          <p className="text-xs text-gray-500">Academic Records Unit</p>
        </div>
      </div>
      <StudentPhoto photoUrl={photoUrl} />
    </header>
  )
}
