import type {
  ResultDetail,
  ResultStatus,
  StudentRecord,
} from "@/features/student-records/types"
import type { SaveResultRecordPayload } from "@/features/result-sheet/types"
import { apiClient, type ApiEnvelope } from "@/lib/api"
import { ResilienceError } from "@/lib/apiErrors"

export type StudentRecordsFilters = {
  status?: ResultStatus
  department?: string
  search?: string
}

function throwEnvelopeError<T>(data: ApiEnvelope<T>, fallback: string): never {
  throw new ResilienceError({
    kind: "unknown",
    message: data.message ?? fallback,
    retryable: true,
  })
}

export async function fetchStudentRecords(
  filters: StudentRecordsFilters = {},
): Promise<StudentRecord[]> {
  const { data } = await apiClient.get<ApiEnvelope<StudentRecord[]>>(
    "/student-records",
    { params: filters },
  )

  if (!data.success || !data.data) {
    return throwEnvelopeError(data, "Failed to load student records.")
  }

  return data.data
}

export async function updateResultStatus(
  id: string,
  status: ResultStatus,
): Promise<ResultDetail> {
  const { data } = await apiClient.patch<ApiEnvelope<ResultDetail>>(
    `/results/${id}/status`,
    { status },
  )

  if (!data.success || !data.data) {
    return throwEnvelopeError(data, "Failed to update status.")
  }

  return data.data
}

export async function updateResultRecord(
  id: string,
  payload: SaveResultRecordPayload,
): Promise<ResultDetail> {
  const { data } = await apiClient.put<ApiEnvelope<ResultDetail>>(
    `/results/${id}`,
    payload,
  )

  if (!data.success || !data.data) {
    return throwEnvelopeError(data, "Failed to update result.")
  }

  return data.data
}

export async function fetchResultById(id: string): Promise<ResultDetail> {
  const { data } = await apiClient.get<ApiEnvelope<ResultDetail>>(
    `/results/${id}`,
  )

  if (!data.success || !data.data) {
    return throwEnvelopeError(data, "Failed to load result.")
  }

  return data.data
}

export type StudentCalculatorPrefill = {
  studentName: string
  matricNumber: string
  department: string
  faculty?: string
  programme?: string
  level: string
  academicSession: string
  currentGpa: string
  totalCreditUnits: string
  photoUrl?: string
  semester?: string
}

function firstSemesterGpaFromRecord(record: StudentRecord, detail: ResultDetail): number {
  if (detail.summary.firstSemesterGpa !== null && detail.summary.firstSemesterGpa !== undefined) {
    return detail.summary.firstSemesterGpa
  }
  if (record.semester.toLowerCase().includes("first")) {
    return record.gpa
  }
  const entered = Number(detail.student.currentGpa)
  if (Number.isFinite(entered)) return entered
  return record.gpa
}

export async function lookupStudentForCalculator(
  search: string,
): Promise<StudentCalculatorPrefill> {
  const term = search.trim()
  if (!term) {
    throw new ResilienceError({
      kind: "unknown",
      message: "Enter a student name or matric number to search.",
      retryable: false,
    })
  }

  const records = await fetchStudentRecords({ search: term })
  const match =
    records.find((record) => record.semester.toLowerCase().includes("first")) ??
    records[0]

  if (!match) {
    throw new ResilienceError({
      kind: "notFound",
      message: "No saved result was found for that student.",
      retryable: false,
    })
  }

  const detail = await fetchResultById(match.id)
  const firstSemesterGpa = firstSemesterGpaFromRecord(match, detail)

  return {
    studentName: detail.student.studentName,
    matricNumber: detail.student.matricNumber,
    department: detail.student.department,
    faculty: detail.student.faculty,
    programme: detail.student.programme,
    level: detail.student.level,
    academicSession: detail.student.academicSession,
    currentGpa: firstSemesterGpa.toFixed(2),
    totalCreditUnits: String(detail.summary.totalCreditUnits),
    photoUrl: detail.student.photoUrl,
    semester: "Second Semester",
  }
}
