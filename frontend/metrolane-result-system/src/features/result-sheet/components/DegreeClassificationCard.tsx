import { Star } from "lucide-react"

interface DegreeClassificationCardProps {
  classification: string
}

export function DegreeClassificationCard({
  classification,
}: DegreeClassificationCardProps) {
  return (
    <div className="rounded-xl bg-orange-500 p-5 text-white shadow-md">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
        <Star className="h-4 w-4" />
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-orange-100">
        Degree Classification
      </p>
      <p className="mt-2 text-xl font-bold leading-tight">{classification}</p>
      <p className="mt-3 text-xs italic text-orange-100">
        Classification will be calculated when backend logic is connected.
      </p>
    </div>
  )
}
