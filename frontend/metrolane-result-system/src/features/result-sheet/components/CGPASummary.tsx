import { DegreeClassificationCard } from "./DegreeClassificationCard"
import type { ResultSheetSummary } from "@/features/result-sheet/types"

interface CGPASummaryProps {
  summary: ResultSheetSummary
  semester?: string
}

export function CGPASummary({ summary, semester }: CGPASummaryProps) {
  const isSecondSemester = semester?.toLowerCase().includes("second") ?? false

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        CGPA Summary
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.firstSemesterGpa ? (
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              First Semester GPA
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {summary.firstSemesterGpa}
            </p>
          </div>
        ) : null}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {isSecondSemester ? "Second Semester GPA" : "Semester GPA"}
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
          {isSecondSemester && summary.firstSemesterGpa ? (
            <p className="mt-2 text-xs text-gray-500">
              ({summary.firstSemesterGpa} + {summary.semesterGpa}) ÷ 2
            </p>
          ) : null}
          <p className="mt-3 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
            {summary.degreeClassification}
          </p>
        </div>

        <DegreeClassificationCard classification={summary.degreeClassification} />
      </div>
    </section>
  )
}
