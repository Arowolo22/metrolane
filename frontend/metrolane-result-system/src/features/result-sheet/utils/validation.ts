import { z } from "zod"

import { courseRecordSchema } from "@/features/calculator/utils/validation"
import type { CourseRecord } from "@/features/calculator/types"
import type { StudentInformationFormValues } from "@/features/calculator/utils/validation"

import { getSavedCourses } from "./resultHelpers"

export const resultGenerationStudentSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  matricNumber: z.string().min(1, "Matric number is required"),
  faculty: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  programme: z.string().optional(),
  level: z.string().min(1, "Level is required"),
  semester: z.string().min(1, "Semester is required"),
  academicSession: z.string().min(1, "Academic session is required"),
  currentGpa: z.string().min(1, "Current GPA is required"),
  totalCreditUnits: z.string().min(1, "Total credit units is required"),
})

export interface ResultValidationResult {
  success: boolean
  errors: string[]
}

export function validateResultGeneration(
  student: StudentInformationFormValues,
  courses: CourseRecord[],
): ResultValidationResult {
  const errors: string[] = []

  const studentResult = resultGenerationStudentSchema.safeParse(student)
  if (!studentResult.success) {
    studentResult.error.issues.forEach((issue) => {
      errors.push(issue.message)
    })
  }

  const savedCourses = getSavedCourses(courses)

  if (savedCourses.length === 0) {
    errors.push("Add and save at least one course before generating the result.")
  }

  if (courses.some((course) => course.isEditing)) {
    errors.push("Save or cancel all courses currently being edited.")
  }

  savedCourses.forEach((course, index) => {
    const courseResult = courseRecordSchema.safeParse({
      courseCode: course.courseCode,
      courseTitle: course.courseTitle,
      creditUnit: course.creditUnit,
      continuousAssessment: course.continuousAssessment,
      examinationScore: course.examinationScore,
    })

    if (!courseResult.success) {
      courseResult.error.issues.forEach((issue) => {
        errors.push(`Course ${index + 1}: ${issue.message}`)
      })
    }
  })

  return {
    success: errors.length === 0,
    errors,
  }
}
