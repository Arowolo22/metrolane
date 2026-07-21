export type ResultStatus = "Generated" | "Approved" | "Pending" | "Rejected"

export interface CourseResult {
  courseCode: string
  courseTitle: string
  creditUnit: number
  continuousAssessment: number
  examinationScore: number
  total: number
  grade: string
  gradePoint: number
}

export interface StudentRecord {
  id: string
  studentName: string
  matricNumber: string
  department: string
  programme: string
  level: string
  semester: string
  gpa: number
  cgpa: number | null
  status: ResultStatus
  results: CourseResult[]
  totalCreditUnits: number
  totalGradePoints: number
  academicStanding: string
  academicSession: string
  faculty: string
}
