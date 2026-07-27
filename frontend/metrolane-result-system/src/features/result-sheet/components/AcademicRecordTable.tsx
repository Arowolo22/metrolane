import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { CourseRecord } from "@/features/calculator/types"
import { PLACEHOLDER_VALUE } from "@/lib/utils"
import { computeTotalScore } from "@/features/result-sheet/utils/resultHelpers"

interface AcademicRecordTableProps {
  courses: CourseRecord[]
}

export function AcademicRecordTable({ courses }: AcademicRecordTableProps) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Academic Record
      </h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-orange-500 hover:bg-orange-500">
              <TableHead className="text-white">Course Code</TableHead>
              <TableHead className="text-white">Course Title</TableHead>
              <TableHead className="text-white">Credit Unit</TableHead>
              <TableHead className="text-white">CA</TableHead>
              <TableHead className="text-white">Exam</TableHead>
              <TableHead className="text-white">Total</TableHead>
              <TableHead className="text-white">Grade</TableHead>
              <TableHead className="text-white">GP</TableHead>
              <TableHead className="text-white">QP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-semibold text-orange-600">
                  {course.courseCode}
                </TableCell>
                <TableCell>{course.courseTitle}</TableCell>
                <TableCell>{course.creditUnit}</TableCell>
                <TableCell>{course.continuousAssessment}</TableCell>
                <TableCell>{course.examinationScore}</TableCell>
                <TableCell>
                  {computeTotalScore(
                    course.continuousAssessment,
                    course.examinationScore,
                  )}
                </TableCell>
                <TableCell>{PLACEHOLDER_VALUE}</TableCell>
                <TableCell>{PLACEHOLDER_VALUE}</TableCell>
                <TableCell>{PLACEHOLDER_VALUE}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
