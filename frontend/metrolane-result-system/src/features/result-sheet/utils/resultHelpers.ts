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

export type BackendResultSummary = {
  totalCourses: number
  totalCreditUnits: number
  totalQualityPoints: number
  semesterGpa: number
  firstSemesterGpa: number | null
  cumulativeGpa: number | null
  academicStanding: string
  degreeClassification: string
  academicRemarks: string
}

export function mapBackendSummaryToSheetSummary(
  summary: BackendResultSummary,
): ResultSheetSummary {
  return {
    totalCourses: summary.totalCourses,
    totalCreditUnits: summary.totalCreditUnits,
    totalGradePoints: summary.totalQualityPoints.toFixed(2),
    semesterGpa: summary.semesterGpa.toFixed(2),
    firstSemesterGpa:
      summary.firstSemesterGpa !== null
        ? summary.firstSemesterGpa.toFixed(2)
        : null,
    cumulativeGpa: (summary.cumulativeGpa ?? summary.semesterGpa).toFixed(2),
    academicStanding: summary.academicStanding,
    degreeClassification: summary.degreeClassification,
    academicRemarks: summary.academicRemarks,
  }
}

function classifyNbte(gpa: number): string {
  if (gpa >= 3.5) return "Distinction"
  if (gpa >= 3.0) return "Upper Credit"
  if (gpa >= 2.5) return "Lower Credit"
  if (gpa >= 2.0) return "Pass"
  return "Fail"
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
  const classification = classifyNbte(semesterGpa)

  return {
    totalCourses: courses.length,
    totalCreditUnits,
    totalGradePoints: totalGradePoints.toFixed(2),
    semesterGpa: semesterGpa.toFixed(2),
    firstSemesterGpa: null,
    cumulativeGpa: semesterGpa.toFixed(2),
    academicStanding: classification,
    degreeClassification: classification,
    academicRemarks: `${classification}. Semester result on record.`,
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
