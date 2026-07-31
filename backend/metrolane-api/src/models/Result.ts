import { Schema, model, type Document, type Types } from "mongoose"

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
  faculty: string
  department: string
  programme: string
  level: string
  semester: string
  academicSession: string
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
  student: IStudentInfo
  courses: ICourseResult[]
  summary: IResultSummary
  status: ResultStatus
  filename: string
  pdfUrl?: string
  generatedAt: Date
  createdBy: Types.ObjectId
}

export interface IResultDocument extends IResult, Document {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const courseResultSchema = new Schema<ICourseResult>(
  {
    courseCode: { type: String, required: true },
    courseTitle: { type: String, required: true },
    creditUnit: { type: Number, required: true },
    continuousAssessment: { type: Number, required: true },
    examinationScore: { type: Number, required: true },
    total: { type: Number, required: true },
    grade: { type: String, required: true },
    gradePoint: { type: Number, required: true },
    qualityPoints: { type: Number, required: true },
  },
  { _id: false },
)

const studentInfoSchema = new Schema<IStudentInfo>(
  {
    studentName: { type: String, required: true },
    matricNumber: { type: String, required: true, index: true },
    faculty: { type: String, required: true },
    department: { type: String, required: true },
    programme: { type: String, required: true },
    level: { type: String, required: true },
    semester: { type: String, required: true },
    academicSession: { type: String, required: true },
    photoUrl: { type: String },
  },
  { _id: false },
)

const resultSummarySchema = new Schema<IResultSummary>(
  {
    totalCourses: { type: Number, required: true },
    totalCreditUnits: { type: Number, required: true },
    totalQualityPoints: { type: Number, required: true },
    semesterGpa: { type: Number, required: true },
    cumulativeGpa: { type: Number, default: null },
    academicStanding: { type: String, required: true },
    degreeClassification: { type: String, required: true },
    academicRemarks: { type: String, required: true },
  },
  { _id: false },
)

const resultSchema = new Schema<IResultDocument>(
  {
    student: { type: studentInfoSchema, required: true },
    courses: { type: [courseResultSchema], required: true },
    summary: { type: resultSummarySchema, required: true },
    status: {
      type: String,
      enum: ["Generated", "Approved", "Pending", "Rejected"],
      default: "Generated",
    },
    filename: { type: String, required: true },
    pdfUrl: { type: String },
    generatedAt: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

resultSchema.index({ "student.matricNumber": 1, "student.academicSession": 1, "student.semester": 1 })

export const Result = model<IResultDocument>("Result", resultSchema)
