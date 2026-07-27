import type { ResultSheetSummary } from "@/features/result-sheet/types"

interface SemesterSummaryProps {
  summary: ResultSheetSummary
}

export function SemesterSummary({ summary }: SemesterSummaryProps) {
  const items = [
    { label: "Total Registered Courses", value: String(summary.totalCourses) },
    { label: "Total Credit Units", value: String(summary.totalCreditUnits) },
    { label: "Total Grade Points", value: summary.totalGradePoints },
    { label: "Semester GPA", value: summary.semesterGpa },
  ]

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Semester Summary
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-gray-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
