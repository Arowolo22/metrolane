import { motion } from "framer-motion"

import { Card, CardContent } from "@/components/ui/card"
import type { CourseRecord } from "@/features/calculator/types"
import { getGradePoint } from "@/features/result-sheet/utils/resultHelpers"

interface SemesterGPACardProps {
  courses: CourseRecord[]
}

export function SemesterGPACard({ courses }: SemesterGPACardProps) {
  const totalCreditUnits = courses.reduce((sum, course) => {
    const units = Number(course.creditUnit)
    return sum + (Number.isNaN(units) ? 0 : units)
  }, 0)

  const totalGradePoints = courses.reduce((sum, course) => {
    const totalScore = Number(course.continuousAssessment) + Number(course.examinationScore)
    const gradePoint = Number.isNaN(totalScore) ? 0 : getGradePoint(totalScore)
    const units = Number(course.creditUnit)
    return sum + (Number.isNaN(units) ? 0 : gradePoint * units)
  }, 0)

  const semesterGpa = totalCreditUnits > 0 ? totalGradePoints / totalCreditUnits : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
    >
      <Card className="bg-gray-50/50">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-gray-500">Semester GPA</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {semesterGpa.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
