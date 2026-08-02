import {
  findActiveResultByMatricSessionSemester,
  findResultById,
  insertResult,
  listResults,
  sumPreviousTotals,
  updateResultPdfUrl,
  updateResultStatusRow,
  type IResult,
  type ResultStatus,
} from "../models/Result.js"
import { AppError } from "../middleware/errorHandler.js"
import {
  academicStandingFromGpa,
  classifyCgpa,
  computeCgpa,
  computeCourseResults,
  computeGpa,
  type CourseInput,
} from "./grading.service.js"

export type CreateResultInput = {
  student: {
    studentName: string
    matricNumber: string
    faculty: string
    department: string
    programme: string
    level: string
    semester: string
    academicSession: string
    photoUrl?: string
  }
  courses: Array<{
    courseCode: string
    courseTitle: string
    creditUnit: string | number
    continuousAssessment: string | number
    examinationScore: string | number
  }>
  generatedAt: string
  filename: string
  pdfBase64?: string
}

function normalizeCourse(course: CreateResultInput["courses"][number]): CourseInput {
  return {
    courseCode: course.courseCode.trim(),
    courseTitle: course.courseTitle.trim(),
    creditUnit: Number(course.creditUnit),
    continuousAssessment: Number(course.continuousAssessment),
    examinationScore: Number(course.examinationScore),
  }
}

function buildAcademicRemarks(gpa: number, cgpa: number | null): string {
  const standing = academicStandingFromGpa(gpa)
  if (cgpa === null) {
    return `${standing}. First semester result on record.`
  }
  const classification = classifyCgpa(cgpa)
  return `${standing}. Cumulative classification: ${classification}.`
}

export async function createResult(
  input: CreateResultInput,
  createdBy: string,
): Promise<IResult> {
  const normalizedCourses = input.courses.map(normalizeCourse)
  const computedCourses = computeCourseResults(normalizedCourses)
  const { gpa, totalCreditUnits, totalQualityPoints } = computeGpa(computedCourses)

  const matricNumber = input.student.matricNumber.trim().toUpperCase()

  const duplicate = await findActiveResultByMatricSessionSemester(
    matricNumber,
    input.student.academicSession,
    input.student.semester,
  )

  if (duplicate) {
    throw new AppError(
      "A result for this student, session, and semester already exists",
      409,
    )
  }

  const { previousQualityPoints, previousCreditUnits } =
    await sumPreviousTotals(matricNumber)

  const cumulativeGpa = computeCgpa(
    previousQualityPoints,
    previousCreditUnits,
    totalQualityPoints,
    totalCreditUnits,
  )

  const degreeClassification =
    cumulativeGpa !== null ? classifyCgpa(cumulativeGpa) : classifyCgpa(gpa)

  const result = await insertResult({
    student: {
      ...input.student,
      matricNumber,
    },
    courses: computedCourses,
    summary: {
      totalCourses: computedCourses.length,
      totalCreditUnits,
      totalQualityPoints,
      semesterGpa: gpa,
      cumulativeGpa,
      academicStanding: academicStandingFromGpa(gpa),
      degreeClassification,
      academicRemarks: buildAcademicRemarks(gpa, cumulativeGpa),
    },
    status: "Generated",
    filename: input.filename,
    generatedAt: input.generatedAt,
    createdBy,
  })

  return result
}

export async function attachResultPdf(id: string, pdfUrl: string): Promise<void> {
  await updateResultPdfUrl(id, pdfUrl)
}

export async function getResultById(id: string): Promise<IResult> {
  const result = await findResultById(id)
  if (!result) {
    throw new AppError("Result not found", 404)
  }
  return result
}

export async function listStudentRecords(filters?: {
  status?: ResultStatus
  department?: string
  search?: string
}): Promise<IResult[]> {
  return listResults(filters)
}

export async function updateResultStatus(
  id: string,
  status: ResultStatus,
): Promise<IResult> {
  const result = await updateResultStatusRow(id, status)
  if (!result) {
    throw new AppError("Result not found", 404)
  }
  return result
}

export function formatResultDetail(result: IResult) {
  return {
    id: result.id,
    student: result.student,
    courses: result.courses.map((course) => ({
      courseCode: course.courseCode,
      courseTitle: course.courseTitle,
      creditUnit: course.creditUnit,
      continuousAssessment: course.continuousAssessment,
      examinationScore: course.examinationScore,
      total: course.total,
      grade: course.grade,
      gradePoint: course.gradePoint,
    })),
    summary: result.summary,
    status: result.status,
    filename: result.filename,
    pdfUrl: result.pdfUrl,
    generatedAt: result.generatedAt,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  }
}

export function formatStudentRecordListItem(result: IResult) {
  return {
    id: result.id,
    studentName: result.student.studentName,
    matricNumber: result.student.matricNumber,
    department: result.student.department,
    programme: result.student.programme,
    level: result.student.level,
    semester: result.student.semester,
    gpa: result.summary.semesterGpa,
    cgpa: result.summary.cumulativeGpa,
    status: result.status,
    results: result.courses.map((course) => ({
      courseCode: course.courseCode,
      courseTitle: course.courseTitle,
      creditUnit: course.creditUnit,
      continuousAssessment: course.continuousAssessment,
      examinationScore: course.examinationScore,
      total: course.total,
      grade: course.grade,
      gradePoint: course.gradePoint,
    })),
    totalCreditUnits: result.summary.totalCreditUnits,
    totalGradePoints: result.summary.totalQualityPoints,
    academicStanding: result.summary.academicStanding,
    academicSession: result.student.academicSession,
    faculty: result.student.faculty,
  }
}
