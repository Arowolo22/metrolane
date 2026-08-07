import { z } from "zod"

import { hasMetrolanePepper } from "../utils/adminPassword.js"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().default(false),
})

export const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
  confirmPassword: z.string().min(1),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => hasMetrolanePepper(data.password), {
  message: 'Administrator passwords must be included',
  path: ["password"],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
  confirmPassword: z.string().min(1),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})

const courseSchema = z.object({
  courseCode: z.string().min(1),
  courseTitle: z.string().min(1),
  creditUnit: z.union([z.string(), z.number()]),
  continuousAssessment: z.union([z.string(), z.number()]),
  examinationScore: z.union([z.string(), z.number()]),
})

export const createResultSchema = z.object({
  student: z.object({
    studentName: z.string().min(1),
    matricNumber: z.string().min(1),
    faculty: z.string().optional(),
    department: z.string().min(1),
    programme: z.string().optional(),
    level: z.string().min(1),
    semester: z.string().min(1),
    academicSession: z.string().min(1),
    currentGpa: z.union([z.string(), z.number()]).optional(),
    totalCreditUnits: z.union([z.string(), z.number()]).optional(),
    photoUrl: z.string().url().optional(),
  }),
  courses: z.array(courseSchema).min(1),
  generatedAt: z.string().datetime(),
  filename: z.string().min(1),
  pdfBase64: z.string().optional(),
})

export const updateStatusSchema = z.object({
  status: z.enum(["Generated", "Approved", "Pending", "Rejected"]),
})

export const studentRecordsQuerySchema = z.object({
  status: z.enum(["Generated", "Approved", "Pending", "Rejected"]).optional(),
  department: z.string().optional(),
  search: z.string().optional(),
})

export const uploadStudentPhotoSchema = z.object({
  matricNumber: z.string().min(1),
  photoBase64: z.string().min(1),
  mimeType: z.string().regex(/^image\//, "File must be an image"),
})
