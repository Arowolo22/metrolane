import type { Types } from "mongoose"

import { Result, type IResultDocument, type ResultStatus } from "../models/Result.js"
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

async function getPreviousTotals(matricNumber: string, excludeId?: string) {
  const filter: Record<string, unknown> = {
    "student.matricNumber": matricNumber.trim().toUpperCase(),
    status: { $ne: "Rejected" },
  }
  if (excludeId) {
    filter._id = { $ne: excludeId }
  }

  const previousResults = await Result.find(filter).select("summary courses")
  let previousQualityPoints = 0
  let previousCreditUnits = 0

  for (const result of previousResults) {
    previousQualityPoints += result.summary.totalQualityPoints
    previousCreditUnits += result.summary.totalCreditUnits
  }

  return { previousQualityPoints, previousCreditUnits }
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
  createdBy: Types.ObjectId,
): Promise<IResultDocument> {
  const normalizedCourses = input.courses.map(normalizeCourse)
  const computedCourses = computeCourseResults(normalizedCourses)
  const { gpa, totalCreditUnits, totalQualityPoints } = computeGpa(computedCourses)

  const matricNumber = input.student.matricNumber.trim().toUpperCase()
  const duplicate = await Result.findOne({
    "student.matricNumber": matricNumber,
    "student.academicSession": input.student.academicSession,
    "student.semester": input.student.semester,
    status: { $ne: "Rejected" },
  })

  if (duplicate) {
    throw new AppError(
      "A result for this student, session, and semester already exists",
      409,
    )
  }

  const { previousQualityPoints, previousCreditUnits } =
    await getPreviousTotals(matricNumber)

  const cumulativeGpa = computeCgpa(
    previousQualityPoints,
    previousCreditUnits,
    totalQualityPoints,
    totalCreditUnits,
  )

  const degreeClassification =
    cumulativeGpa !== null ? classifyCgpa(cumulativeGpa) : classifyCgpa(gpa)

  const result = await Result.create({
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
    generatedAt: new Date(input.generatedAt),
    createdBy,
  })

  return result
}

export async function getResultById(id: string): Promise<IResultDocument> {
  const result = await Result.findById(id).populate("createdBy", "firstName lastName email")
  if (!result) {
    throw new AppError("Result not found", 404)
  }
  return result
}

export async function listStudentRecords(filters?: {
  status?: ResultStatus
  department?: string
  search?: string
}) {
  const query: Record<string, unknown> = {}

  if (filters?.status) {
    query.status = filters.status
  }
  if (filters?.department) {
    query["student.department"] = filters.department
  }
  if (filters?.search) {
    const term = filters.search.trim()
    query.$or = [
      { "student.studentName": { $regex: term, $options: "i" } },
      { "student.matricNumber": { $regex: term, $options: "i" } },
    ]
  }

  const results = await Result.find(query)
    .sort({ createdAt: -1 })
    .select("-courses")

  return results.map((result) => ({
    id: result._id.toString(),
    studentName: result.student.studentName,
    matricNumber: result.student.matricNumber,
    department: result.student.department,
    programme: result.student.programme,
    level: result.student.level,
    semester: result.student.semester,
    gpa: result.summary.semesterGpa,
    cgpa: result.summary.cumulativeGpa,
    status: result.status,
    totalCreditUnits: result.summary.totalCreditUnits,
    totalGradePoints: result.summary.totalQualityPoints,
    academicStanding: result.summary.academicStanding,
    academicSession: result.student.academicSession,
    faculty: result.student.faculty,
    generatedAt: result.generatedAt,
    filename: result.filename,
  }))
}

export async function updateResultStatus(
  id: string,
  status: ResultStatus,
): Promise<IResultDocument> {
  const validStatuses: ResultStatus[] = ["Generated", "Approved", "Pending", "Rejected"]
  if (!validStatuses.includes(status)) {
    throw new AppError("Invalid status value", 400)
  }

  const result = await Result.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  )

  if (!result) {
    throw new AppError("Result not found", 404)
  }

  return result
}

export function formatResultDetail(result: IResultDocument) {
  return {
    id: result._id.toString(),
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

export function formatStudentRecordListItem(result: IResultDocument) {
  return {
    id: result._id.toString(),
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
