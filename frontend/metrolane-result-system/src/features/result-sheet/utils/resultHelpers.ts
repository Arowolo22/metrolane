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

export function getGradeFromScore(totalScore: number): string {
  if (totalScore >= 75) return "A"
  if (totalScore >= 70) return "AB"
  if (totalScore >= 65) return "B"
  if (totalScore >= 60) return "BC"
  if (totalScore >= 55) return "C"
  if (totalScore >= 50) return "CD"
  if (totalScore >= 45) return "D"
  if (totalScore >= 40) return "E"
  return "F"
}

export function getGradePoint(totalScore: number): number {
  if (totalScore >= 75) return 4.0
  if (totalScore >= 70) return 3.5
  if (totalScore >= 65) return 3.25
  if (totalScore >= 60) return 3.0
  if (totalScore >= 55) return 2.75
  if (totalScore >= 50) return 2.5
  if (totalScore >= 45) return 2.25
  if (totalScore >= 40) return 2.0
  return 0
}

export function getCoursePerformance(course: Pick<CourseRecord, "creditUnit" | "continuousAssessment" | "examinationScore">) {
  const totalScore = Number(course.continuousAssessment) + Number(course.examinationScore)
  const grade = Number.isNaN(totalScore) ? "" : getGradeFromScore(totalScore)
  const gradePoint = Number.isNaN(totalScore) ? 0 : getGradePoint(totalScore)
  const units = Number(course.creditUnit)
  const qualityPoints = Number.isNaN(units) ? 0 : gradePoint * units

  return {
    grade,
    gradePoint,
    qualityPoints,
  }
}

export function buildResultSummary(courses: CourseRecord[]): ResultSheetSummary {
  const totalCreditUnits = courses.reduce((sum, course) => {
    const units = Number(course.creditUnit)
    return sum + (Number.isNaN(units) ? 0 : units)
  }, 0)

  const totalGradePoints = courses.reduce((sum, course) => {
    const { qualityPoints } = getCoursePerformance(course)
    return sum + qualityPoints
  }, 0)

  const semesterGpa = totalCreditUnits > 0 ? totalGradePoints / totalCreditUnits : 0

  const cumulativeGpa = semesterGpa
  const degreeClassification =
    semesterGpa >= 4.5
      ? "First Class"
      : semesterGpa >= 3.5
        ? "Second Class Upper"
        : semesterGpa >= 2.5
          ? "Second Class Lower"
          : semesterGpa >= 1.5
            ? "Third Class"
            : "Pass"

  const academicStanding =
    semesterGpa >= 4.5
      ? "Excellent"
      : semesterGpa >= 3.5
        ? "Very Good"
        : semesterGpa >= 2.5
          ? "Good"
          : semesterGpa >= 1.5
            ? "Fair"
            : "Needs Improvement"

  const academicRemarks =
    semesterGpa >= 4.5
      ? "Outstanding performance. Keep the momentum."
      : semesterGpa >= 3.5
        ? "Excellent academic progress."
        : semesterGpa >= 2.5
          ? "Good performance overall."
          : semesterGpa >= 1.5
            ? "You can improve with more consistency."
            : "More effort is needed to improve performance."

  return {
    totalCourses: courses.length,
    totalCreditUnits,
    totalGradePoints: totalGradePoints.toFixed(2),
    semesterGpa: semesterGpa.toFixed(2),
    cumulativeGpa: cumulativeGpa.toFixed(2),
    academicStanding,
    degreeClassification,
    academicRemarks,
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
