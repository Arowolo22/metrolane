export type GradeInfo = {
  grade: string
  gradePoint: number
}

export type DiplomaClassification =
  | "Distinction"
  | "Upper Credit"
  | "Lower Credit"
  | "Pass"
  | "Fail"

/** Maximum achievable GPA/CGPA on the NBTE 4.0 scale */
export const MAX_GPA = 4.0

/**
 * NBTE diploma classification bands (CGPA / GPA):
 * - Distinction:     3.50 – 4.00
 * - Upper Credit:    3.00 – 3.49
 * - Lower Credit:    2.50 – 2.99
 * - Pass:            2.00 – 2.49
 * - Fail:            0.00 – 1.99
 */
export const CGPA_CLASSIFICATION_BANDS: ReadonlyArray<{
  classification: DiplomaClassification
  min: number
  max: number
}> = [
  { classification: "Distinction", min: 3.5, max: 4.0 },
  { classification: "Upper Credit", min: 3.0, max: 3.49 },
  { classification: "Lower Credit", min: 2.5, max: 2.99 },
  { classification: "Pass", min: 2.0, max: 2.49 },
  { classification: "Fail", min: 0, max: 1.99 },
]

/** NBTE 4.0 score-to-grade conversion for ND/HND programmes */
export function scoreToGrade(totalScore: number): GradeInfo {
  if (totalScore >= 75) return { grade: "A", gradePoint: 4.0 }
  if (totalScore >= 70) return { grade: "AB", gradePoint: 3.5 }
  if (totalScore >= 65) return { grade: "B", gradePoint: 3.25 }
  if (totalScore >= 60) return { grade: "BC", gradePoint: 3.0 }
  if (totalScore >= 55) return { grade: "C", gradePoint: 2.75 }
  if (totalScore >= 50) return { grade: "CD", gradePoint: 2.5 }
  if (totalScore >= 45) return { grade: "D", gradePoint: 2.25 }
  if (totalScore >= 40) return { grade: "E", gradePoint: 2.0 }
  return { grade: "F", gradePoint: 0.0 }
}

export function clampGpa(value: number): number {
  return Number(Math.min(MAX_GPA, Math.max(0, value)).toFixed(2))
}

export function classifyCgpa(cgpa: number): DiplomaClassification {
  const gpa = clampGpa(cgpa)

  if (gpa >= 3.5) return "Distinction"
  if (gpa >= 3.0) return "Upper Credit"
  if (gpa >= 2.5) return "Lower Credit"
  if (gpa >= 2.0) return "Pass"
  return "Fail"
}

/** Semester GPA uses the same classification bands as CGPA */
export function academicStandingFromGpa(gpa: number): DiplomaClassification {
  return classifyCgpa(gpa)
}

export type CourseInput = {
  courseCode: string
  courseTitle: string
  creditUnit: number
  continuousAssessment: number
  examinationScore: number
}

export type ComputedCourseResult = CourseInput & {
  total: number
  grade: string
  gradePoint: number
  qualityPoints: number
}

export function computeCourseResults(courses: CourseInput[]): ComputedCourseResult[] {
  return courses.map((course) => {
    const total = course.continuousAssessment + course.examinationScore
    const { grade, gradePoint } = scoreToGrade(total)
    const qualityPoints = gradePoint * course.creditUnit

    return {
      ...course,
      total,
      grade,
      gradePoint,
      qualityPoints,
    }
  })
}

export function computeGpa(courses: ComputedCourseResult[]): {
  gpa: number
  totalCreditUnits: number
  totalQualityPoints: number
} {
  const totalCreditUnits = courses.reduce((sum, c) => sum + c.creditUnit, 0)
  const totalQualityPoints = courses.reduce((sum, c) => sum + c.qualityPoints, 0)
  const gpa =
    totalCreditUnits > 0
      ? clampGpa(totalQualityPoints / totalCreditUnits)
      : 0

  return { gpa, totalCreditUnits, totalQualityPoints }
}

export function computeCgpaFromSemesterGpas(semesterGpas: number[]): number | null {
  if (semesterGpas.length === 0) return null
  const total = semesterGpas.reduce((sum, gpa) => sum + gpa, 0)
  return clampGpa(total / semesterGpas.length)
}

/** @deprecated Use computeCgpaFromSemesterGpas for session-level cumulative GPA */
export function computeCgpa(
  previousQualityPoints: number,
  previousCreditUnits: number,
  semesterQualityPoints: number,
  semesterCreditUnits: number,
): number | null {
  const totalCredits = previousCreditUnits + semesterCreditUnits
  if (totalCredits === 0) return null

  const totalQuality = previousQualityPoints + semesterQualityPoints
  return clampGpa(totalQuality / totalCredits)
}
