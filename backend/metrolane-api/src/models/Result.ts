import { formatSupabaseError, supabaseAdmin } from "../config/supabase.js"

export type ResultStatus = "Generated" | "Approved" | "Pending" | "Rejected"

export interface ICourseResult {
  courseCode: string
  courseTitle: string
  creditUnit: number
  continuousAssessment: number
  examinationScore: number
  total: number
  grade: string
  gradePoint: number
  qualityPoints: number
}

export interface IStudentInfo {
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

export interface IResultSummary {
  totalCourses: number
  totalCreditUnits: number
  totalQualityPoints: number
  semesterGpa: number
  cumulativeGpa: number | null
  academicStanding: string
  degreeClassification: string
  academicRemarks: string
}

export interface IResult {
  id: string
  student: IStudentInfo
  courses: ICourseResult[]
  summary: IResultSummary
  status: ResultStatus
  filename: string
  pdfUrl?: string
  generatedAt: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

type ResultRow = {
  id: string
  student: IStudentInfo
  courses: ICourseResult[]
  summary: IResultSummary
  status: ResultStatus
  filename: string
  pdf_url: string | null
  generated_at: string
  created_by: string
  created_at: string
  updated_at: string
}

const RESULTS_TABLE = "results"

function fromRow(row: ResultRow): IResult {
  return {
    id: row.id,
    student: row.student,
    courses: row.courses,
    summary: row.summary,
    status: row.status,
    filename: row.filename,
    pdfUrl: row.pdf_url ?? undefined,
    generatedAt: row.generated_at,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function insertResult(input: {
  student: IStudentInfo
  courses: ICourseResult[]
  summary: IResultSummary
  status: ResultStatus
  filename: string
  generatedAt: string
  createdBy: string
}): Promise<IResult> {
  const { data, error } = await supabaseAdmin
    .from(RESULTS_TABLE)
    .insert({
      student: input.student,
      courses: input.courses,
      summary: input.summary,
      status: input.status,
      filename: input.filename,
      generated_at: input.generatedAt,
      created_by: input.createdBy,
    })
    .select("*")
    .single()

  if (error) {
    throw formatSupabaseError(error, "Failed to save result")
  }

  return fromRow(data as ResultRow)
}

export async function findResultById(id: string): Promise<IResult | null> {
  const { data, error } = await supabaseAdmin
    .from(RESULTS_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw formatSupabaseError(error, "Failed to look up result")
  }

  return data ? fromRow(data as ResultRow) : null
}

export async function findActiveResultByMatricSessionSemester(
  matricNumber: string,
  academicSession: string,
  semester: string,
): Promise<IResult | null> {
  const { data, error } = await supabaseAdmin
    .from(RESULTS_TABLE)
    .select("*")
    .eq("student->>matricNumber", matricNumber)
    .eq("student->>academicSession", academicSession)
    .eq("student->>semester", semester)
    .neq("status", "Rejected")
    .maybeSingle()

  if (error) {
    throw formatSupabaseError(error, "Failed to check for duplicate result")
  }

  return data ? fromRow(data as ResultRow) : null
}

export async function sumPreviousTotals(matricNumber: string): Promise<{
  previousQualityPoints: number
  previousCreditUnits: number
}> {
  const { data, error } = await supabaseAdmin
    .from(RESULTS_TABLE)
    .select("summary")
    .eq("student->>matricNumber", matricNumber)
    .neq("status", "Rejected")

  if (error) {
    throw formatSupabaseError(error, "Failed to compute previous totals")
  }

  let previousQualityPoints = 0
  let previousCreditUnits = 0

  for (const row of (data ?? []) as Array<{ summary: IResultSummary }>) {
    previousQualityPoints += row.summary.totalQualityPoints
    previousCreditUnits += row.summary.totalCreditUnits
  }

  return { previousQualityPoints, previousCreditUnits }
}

export async function updateResultStatusRow(
  id: string,
  status: ResultStatus,
): Promise<IResult | null> {
  const { data, error } = await supabaseAdmin
    .from(RESULTS_TABLE)
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle()

  if (error) {
    throw formatSupabaseError(error, "Failed to update result status")
  }

  return data ? fromRow(data as ResultRow) : null
}

export async function updateResultPdfUrl(
  id: string,
  pdfUrl: string,
): Promise<void> {
  const { error } = await supabaseAdmin
    .from(RESULTS_TABLE)
    .update({ pdf_url: pdfUrl })
    .eq("id", id)

  if (error) {
    throw formatSupabaseError(error, "Failed to attach PDF url")
  }
}

export async function listResults(filters?: {
  status?: ResultStatus
  department?: string
  search?: string
}): Promise<IResult[]> {
  let query = supabaseAdmin
    .from(RESULTS_TABLE)
    .select("*")
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.department) {
    query = query.eq("student->>department", filters.department)
  }

  const { data, error } = await query
  if (error) {
    throw formatSupabaseError(error, "Failed to list results")
  }

  const results = (data ?? []).map((row) => fromRow(row as ResultRow))

  const term = filters?.search?.trim().toLowerCase()
  if (!term) {
    return results
  }

  return results.filter(
    (result) =>
      result.student.studentName.toLowerCase().includes(term) ||
      result.student.matricNumber.toLowerCase().includes(term),
  )
}
