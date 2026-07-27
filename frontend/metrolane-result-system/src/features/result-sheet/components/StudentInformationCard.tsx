import type { StudentInformationFormValues } from "@/features/calculator/utils/validation"
import { formatDisplayDate } from "@/features/result-sheet/utils/resultHelpers"

interface StudentInformationCardProps {
  student: StudentInformationFormValues
  generatedAt: Date
}

const fields: Array<{
  label: string
  key: keyof StudentInformationFormValues | "dateGenerated"
}> = [
  { label: "Student Name", key: "studentName" },
  { label: "Matric Number", key: "matricNumber" },
  { label: "Faculty", key: "faculty" },
  { label: "Department", key: "department" },
  { label: "Programme", key: "programme" },
  { label: "Level", key: "level" },
  { label: "Semester", key: "semester" },
  { label: "Academic Session", key: "academicSession" },
  { label: "Date Generated", key: "dateGenerated" },
]

export function StudentInformationCard({
  student,
  generatedAt,
}: StudentInformationCardProps) {
  return (
    <section className="rounded-xl bg-gray-50 p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Student Information
      </h2>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(({ label, key }) => (
          <div key={key}>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-gray-900">
              {key === "dateGenerated"
                ? formatDisplayDate(generatedAt)
                : key === "level"
                  ? `Level ${student.level}`
                  : student[key]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
