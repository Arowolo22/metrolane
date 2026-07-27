import type { CourseRecord } from "@/features/calculator/types"
import { PLACEHOLDER_VALUE } from "@/lib/utils"

import type { ResultSheetSummary } from "../types"

export function computeTotalScore(
  continuousAssessment: string,
  examinationScore: string,
): string {
  const ca = Number(continuousAssessment)
  const exam = Number(examinationScore)
  if (Number.isNaN(ca) || Number.isNaN(exam)) return PLACEHOLDER_VALUE
  return String(ca + exam)
}

export function buildResultSummary(courses: CourseRecord[]): ResultSheetSummary {
  const totalCreditUnits = courses.reduce((sum, course) => {
    const units = Number(course.creditUnit)
    return sum + (Number.isNaN(units) ? 0 : units)
  }, 0)

  return {
    totalCourses: courses.length,
    totalCreditUnits,
    totalGradePoints: PLACEHOLDER_VALUE,
    semesterGpa: PLACEHOLDER_VALUE,
    cumulativeGpa: PLACEHOLDER_VALUE,
    academicStanding: PLACEHOLDER_VALUE,
    degreeClassification: PLACEHOLDER_VALUE,
    academicRemarks: PLACEHOLDER_VALUE,
  }
}

export function sanitizeFilenamePart(value: string): string {
  return value
    .trim()
    .replace(/[/\\?%*:|"<>]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
}

export function buildResultFilename(
  matricNumber: string,
  studentName: string,
  semester: string,
): string {
  const matric = sanitizeFilenamePart(matricNumber)
  const name = sanitizeFilenamePart(studentName.replace(/,/g, ""))
  const semesterPart = sanitizeFilenamePart(
    semester.replace(/\s+/g, ""),
  )
  return `${matric}_${name}_${semesterPart}_Result.pdf`
}

export function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function getSavedCourses(courses: CourseRecord[]): CourseRecord[] {
  return courses.filter((course) => !course.isEditing)
}
