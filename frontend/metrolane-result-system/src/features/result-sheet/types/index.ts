import type { StudentInformationFormValues } from "@/features/calculator/utils/validation"
import type { CourseRecord } from "@/features/calculator/types"

export interface ResultSheetData {
  student: StudentInformationFormValues
  courses: CourseRecord[]
  generatedAt: Date
}

export interface ResultSheetSummary {
  totalCourses: number
  totalCreditUnits: number
  totalGradePoints: string
  semesterGpa: string
  cumulativeGpa: string
  academicStanding: string
  degreeClassification: string
  academicRemarks: string
}

export interface GeneratedResultPayload extends ResultSheetData {
  summary: ResultSheetSummary
  filename: string
}

export interface SaveResultRecordPayload {
  student: StudentInformationFormValues
  courses: Omit<CourseRecord, "isEditing">[]
  generatedAt: string
  filename: string
}

export type ResultPersistenceAdapter = (
  payload: SaveResultRecordPayload,
) => Promise<void>
