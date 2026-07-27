import { BookOpen } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddCourseButton } from "@/features/calculator/components/AddCourseButton"
import { CourseTableRow } from "@/features/calculator/components/CourseTableRow"
import type { CourseRecord } from "@/features/calculator/types"
import type { CourseTemplate } from "@/features/calculator/data/courses"

interface CourseAssessmentTableProps {
  courses: CourseRecord[]
  onAddCourse: (course: CourseTemplate) => void
  onUpdateCourse: (id: string, updates: Partial<CourseRecord>) => void
  onDeleteCourse: (id: string) => void
  onToggleEdit: (id: string, isEditing: boolean) => void
}

export function CourseAssessmentTable({
  courses,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onToggleEdit,
}: CourseAssessmentTableProps) {
  const savedCourses = courses.filter((course) => !course.isEditing)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Course Assessment Register</CardTitle>
          <AddCourseButton
            onSelectCourse={onAddCourse}
            addedCourseCodes={courses.map((course) => course.courseCode).filter(Boolean)}
          />
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
                <BookOpen className="h-7 w-7 text-orange-500" />
              </div>
              <p className="max-w-md text-sm text-gray-600">
                No courses added yet. Click{" "}
                <span className="font-semibold text-orange-500">Add Course</span>{" "}
                to begin entering student results.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Credit Unit</TableHead>
                    <TableHead>CA (0–40)</TableHead>
                    <TableHead>Exam (0–60)</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Grade Point</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <CourseTableRow
                      key={course.id}
                      course={course}
                      onUpdate={onUpdateCourse}
                      onDelete={onDeleteCourse}
                      onToggleEdit={onToggleEdit}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {savedCourses.length > 0 && (
            <p className="mt-3 text-xs text-gray-500">
              {savedCourses.length} course{savedCourses.length !== 1 ? "s" : ""}{" "}
              registered
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
