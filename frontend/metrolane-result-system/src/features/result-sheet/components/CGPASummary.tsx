import { DegreeClassificationCard } from "./DegreeClassificationCard"
import type { ResultSheetSummary } from "@/features/result-sheet/types"

interface CGPASummaryProps {
  summary: ResultSheetSummary
}

export function CGPASummary({ summary }: CGPASummaryProps) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        CGPA Summary
      </h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Semester GPA
          </p>
          <p className="mt-2 text-3xl font-bold text-orange-500">
            {summary.semesterGpa}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Cumulative GPA (CGPA)
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {summary.cumulativeGpa}
          </p>
          <p className="mt-3 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
            Academic Standing: {summary.academicStanding}
          </p>
        </div>
        <DegreeClassificationCard classification={summary.degreeClassification} />
      </div>
    </section>
  )
}
