export type GradeInfo = {
  grade: string
  gradePoint: number
}

/** NBTE 4.0 grading scale for ND/HND programmes */
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

export function classifyCgpa(cgpa: number): string {
  if (cgpa >= 3.5) return "Distinction"
  if (cgpa >= 3.0) return "Upper Credit"
  if (cgpa >= 2.5) return "Lower Credit"
  if (cgpa >= 2.0) return "Pass"
  return "Fail"
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
      ? Number((totalQualityPoints / totalCreditUnits).toFixed(2))
      : 0

  return { gpa, totalCreditUnits, totalQualityPoints }
}

export function computeCgpa(
  previousQualityPoints: number,
  previousCreditUnits: number,
  semesterQualityPoints: number,
  semesterCreditUnits: number,
): number | null {
  const totalCredits = previousCreditUnits + semesterCreditUnits
  if (totalCredits === 0) return null

  const totalQuality =
    previousQualityPoints + semesterQualityPoints
  return Number((totalQuality / totalCredits).toFixed(2))
}

export function academicStandingFromGpa(gpa: number): string {
  if (gpa >= 3.5) return "Excellent Standing"
  if (gpa >= 3.0) return "Good Standing"
  if (gpa >= 2.0) return "Satisfactory Standing"
  return "Probation"
}
