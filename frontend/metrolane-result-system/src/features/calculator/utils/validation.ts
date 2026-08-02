import { z } from "zod"

export const studentInformationSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  matricNumber: z.string().min(1, "Matric number is required"),
  faculty: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  programme: z.string().optional(),
  level: z.string().min(1, "Level is required"),
  semester: z.string().min(1, "Semester is required"),
  academicSession: z.string().min(1, "Academic session is required"),
  currentGpa: z
    .string()
    .min(1, "Current GPA is required")
    .refine((value) => {
      const parsed = Number(value)
      return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 5
    }, { message: "Current GPA must be between 0 and 5" }),
  totalCreditUnits: z
    .string()
    .min(1, "Total credit units is required")
    .refine((value) => {
      const parsed = Number(value)
      return !Number.isNaN(parsed) && parsed >= 0
    }, { message: "Enter a valid credit unit value" }),
  photoUrl: z.string().url().optional(),
})

export type StudentInformationFormValues = z.infer<
  typeof studentInformationSchema
>

export const courseRecordSchema = z.object({
  courseCode: z.string().min(1, "Course code is required"),
  courseTitle: z.string().min(1, "Course title is required"),
  creditUnit: z
    .string()
    .min(1, "Credit unit is required")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
      message: "Enter a valid credit unit",
    }),
  continuousAssessment: z
    .string()
    .min(1, "CA score is required")
    .refine(
      (value) => {
        const score = Number(value)
        return !Number.isNaN(score) && score >= 0 && score <= 40
      },
      { message: "CA score must be between 0 and 40" },
    ),
  examinationScore: z
    .string()
    .min(1, "Exam score is required")
    .refine(
      (value) => {
        const score = Number(value)
        return !Number.isNaN(score) && score >= 0 && score <= 60
      },
      { message: "Exam score must be between 0 and 60" },
    ),
})

export type CourseRecordFormValues = z.infer<typeof courseRecordSchema>
