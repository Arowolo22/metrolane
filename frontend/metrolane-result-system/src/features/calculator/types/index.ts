export interface StudentInformation {
  studentName: string
  matricNumber: string
  programme: string
  level: string
  semester: string
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
  programme: "",
  level: "",
  semester: "",
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
