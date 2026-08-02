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

export interface ResultDetailStudent {
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

export interface ResultDetailSummary {
  totalCourses: number
  totalCreditUnits: number
  totalQualityPoints: number
  semesterGpa: number
  cumulativeGpa: number | null
  academicStanding: string
  degreeClassification: string
  academicRemarks: string
}

export interface ResultDetail {
  id: string
  student: ResultDetailStudent
  courses: CourseResult[]
  summary: ResultDetailSummary
  status: ResultStatus
  filename: string
  pdfUrl?: string
  generatedAt: string
  createdAt: string
  updatedAt: string
}
