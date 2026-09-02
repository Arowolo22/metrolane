import {
  findActiveResultByMatricSessionSemester,
  findResultById,
  findSessionSemesterResults,
  insertResult,
  listResults,
  updateResultPdfUrl,
  updateResultRow,
  updateResultStatusRow,
  type IResult,
  type ResultStatus,
} from "../models/Result.js"
import { AppError } from "../middleware/errorHandler.js"
import {
  classifyCgpa,
  computeCgpaFromSemesterGpas,
  computeCourseResults,
  computeGpa,
  type CourseInput,
} from "./grading.service.js"

export type CreateResultInput = {
  student: {
    studentName: string
    matricNumber: string
    faculty?: string
    department: string
    programme?: string
    level: string
    semester: string
    academicSession: string
    currentGpa?: string | number
    totalCreditUnits?: string | number
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

function buildAcademicRemarks(
  semesterGpa: number,
  firstSemesterGpa: number | null,
  cumulativeGpa: number | null,
  semester: string,
): string {
  const currentClassification = classifyCgpa(semesterGpa)
  const isSecondSemester = semester.toLowerCase().includes("second")

  if (!isSecondSemester || firstSemesterGpa === null) {
    return `${currentClassification}. ${semester} result on record.`
  }

  const cumulativeClassification =
    cumulativeGpa !== null ? classifyCgpa(cumulativeGpa) : currentClassification

  return (
    `${semester}: ${currentClassification} (GPA ${semesterGpa.toFixed(2)}). ` +
    `First Semester GPA: ${firstSemesterGpa.toFixed(2)}. ` +
    `Cumulative GPA: ${cumulativeGpa?.toFixed(2) ?? "N/A"} (${cumulativeClassification}).`
  )
}

function parseOptionalGpa(value: string | number | undefined): number | null {
  if (value === undefined || value === "") return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

async function buildSessionSummary(
  matricNumber: string,
  academicSession: string,
  level: string,
  semester: string,
  semesterGpa: number,
  enteredCurrentGpa?: string | number,
  excludeResultId?: string,
) {
  const previousResults = await findSessionSemesterResults(
    matricNumber,
    academicSession,
    level,
    excludeResultId,
  )

  const isSecondSemester = semester.toLowerCase().includes("second")
  const firstSemesterRecord = previousResults.find((result) =>
    result.semester.toLowerCase().includes("first"),
  )

  const firstSemesterGpa =
    firstSemesterRecord?.semesterGpa ??
    (isSecondSemester ? parseOptionalGpa(enteredCurrentGpa) : null)

  const semesterGpas = isSecondSemester && firstSemesterGpa !== null
    ? [firstSemesterGpa, semesterGpa]
    : [...previousResults.map((result) => result.semesterGpa), semesterGpa]

  const cumulativeGpa = computeCgpaFromSemesterGpas(semesterGpas)
  const degreeClassification = classifyCgpa(cumulativeGpa ?? semesterGpa)

  return {
    firstSemesterGpa,
    cumulativeGpa,
    degreeClassification,
    academicStanding: classifyCgpa(cumulativeGpa ?? semesterGpa),
    academicRemarks: buildAcademicRemarks(
      semesterGpa,
      firstSemesterGpa,
      cumulativeGpa,
      semester,
    ),
  }
}

function buildResultFields(input: CreateResultInput) {
  const normalizedCourses = input.courses.map(normalizeCourse)
  const computedCourses = computeCourseResults(normalizedCourses)
  const { gpa, totalCreditUnits, totalQualityPoints } = computeGpa(computedCourses)

  const matricNumber = input.student.matricNumber.trim().toUpperCase()

  return {
    matricNumber,
    computedCourses,
    gpa,
    totalCreditUnits,
    totalQualityPoints,
  }
}

async function assertNoDuplicate(
  matricNumber: string,
  academicSession: string,
  semester: string,
  excludeResultId?: string,
): Promise<void> {
  const duplicate = await findActiveResultByMatricSessionSemester(
    matricNumber,
    academicSession,
    semester,
    excludeResultId,
  )

  if (duplicate) {
    throw new AppError(
      "A result for this student, session, and semester already exists",
      409,
    )
  }
}

export async function createResult(
  input: CreateResultInput,
  createdBy: string,
): Promise<IResult> {
  const { matricNumber, computedCourses, gpa, totalCreditUnits, totalQualityPoints } =
    buildResultFields(input)

  await assertNoDuplicate(matricNumber, input.student.academicSession, input.student.semester)

  const sessionSummary = await buildSessionSummary(
    matricNumber,
    input.student.academicSession,
    input.student.level,
    input.student.semester,
    gpa,
    input.student.currentGpa,
  )

  const result = await insertResult({
    student: {
      ...input.student,
      matricNumber,
      currentGpa: input.student.currentGpa,
      totalCreditUnits: input.student.totalCreditUnits,
    },
    courses: computedCourses,
    summary: {
      totalCourses: computedCourses.length,
      totalCreditUnits,
      totalQualityPoints,
      semesterGpa: gpa,
      firstSemesterGpa: sessionSummary.firstSemesterGpa,
      cumulativeGpa: sessionSummary.cumulativeGpa,
      academicStanding: sessionSummary.academicStanding,
      degreeClassification: sessionSummary.degreeClassification,
      academicRemarks: sessionSummary.academicRemarks,
    },
    status: "Generated",
    filename: input.filename,
    generatedAt: input.generatedAt,
    createdBy,
  })

  return result
}

export async function updateResult(
  id: string,
  input: CreateResultInput,
): Promise<IResult> {
  const existing = await findResultById(id)
  if (!existing) {
    throw new AppError("Result not found", 404)
  }

  const { matricNumber, computedCourses, gpa, totalCreditUnits, totalQualityPoints } =
    buildResultFields(input)

  await assertNoDuplicate(
    matricNumber,
    input.student.academicSession,
    input.student.semester,
    id,
  )

  const sessionSummary = await buildSessionSummary(
    matricNumber,
    input.student.academicSession,
    input.student.level,
    input.student.semester,
    gpa,
    input.student.currentGpa,
    id,
  )

  const result = await updateResultRow(id, {
    student: {
      ...input.student,
      matricNumber,
      currentGpa: input.student.currentGpa,
      totalCreditUnits: input.student.totalCreditUnits,
    },
    courses: computedCourses,
    summary: {
      totalCourses: computedCourses.length,
      totalCreditUnits,
      totalQualityPoints,
      semesterGpa: gpa,
      firstSemesterGpa: sessionSummary.firstSemesterGpa,
      cumulativeGpa: sessionSummary.cumulativeGpa,
      academicStanding: sessionSummary.academicStanding,
      degreeClassification: sessionSummary.degreeClassification,
      academicRemarks: sessionSummary.academicRemarks,
    },
    status: "Generated",
    filename: input.filename,
    generatedAt: input.generatedAt,
  })

  if (!result) {
    throw new AppError("Result not found", 404)
  }

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
    programme: result.student.programme ?? "",
    level: result.student.level,
    semester: result.student.semester,
    gpa: result.summary.semesterGpa,
    cgpa: result.summary.cumulativeGpa,
    firstSemesterGpa: result.summary.firstSemesterGpa,
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
