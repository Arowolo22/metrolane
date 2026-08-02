export interface StudentInformation {
  studentName: string
  matricNumber: string
  faculty?: string
  department: string
  programme?: string
  level: string
  semester: string
  academicSession: string
  currentGpa?: string
  totalCreditUnits?: string
  photoUrl?: string
}

export interface CourseRecord {
  id: string
  courseCode: string
  courseTitle: string
  creditUnit: string
  continuousAssessment: string
  examinationScore: string
  isEditing: boolean
}

export type CourseRecordInput = Omit<CourseRecord, "id" | "isEditing">

export const EMPTY_STUDENT_INFORMATION: StudentInformation = {
  studentName: "",
  matricNumber: "",
  faculty: "",
  department: "",
  programme: "",
  level: "",
  semester: "",
  academicSession: "",
  currentGpa: "",
  totalCreditUnits: "",
  photoUrl: undefined,
}

export const createEmptyCourse = (): CourseRecord => ({
  id: crypto.randomUUID(),
  courseCode: "",
  courseTitle: "",
  creditUnit: "",
  continuousAssessment: "",
  examinationScore: "",
  isEditing: true,
})
