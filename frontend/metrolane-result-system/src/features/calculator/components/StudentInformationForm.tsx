import { useFormContext } from "react-hook-form"

import { InlineFieldError } from "@/components/states"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { StudentInformationFormValues } from "@/features/calculator/utils/validation"

const departmentOptions = [
  "Department of Community Health Technology",
  "Department of Public Health Technology",
  "Department of Medical Laboratory Technology",
  "Department of Health Information, Education and Promotion",
  "Department of Environmental Health Technology",
] as const

const levelOptions = ["100", "200", "300", "400", "500"] as const
const semesterOptions = ["First Semester", "Second Semester"] as const

export function StudentInformationForm() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<StudentInformationFormValues>()

  const department = watch("department")
  const level = watch("level")
  const semester = watch("semester")

  return (
    <div className="grid flex-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="studentName">Student Name</Label>
        <Input id="studentName" placeholder="Enter student full name" aria-invalid={Boolean(errors.studentName)} aria-describedby={errors.studentName ? "studentName-error" : undefined} {...register("studentName")} />
        <InlineFieldError id="studentName-error" message={errors.studentName?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="matricNumber">Matric Number</Label>
        <Input id="matricNumber" placeholder="Enter matric number" aria-invalid={Boolean(errors.matricNumber)} aria-describedby={errors.matricNumber ? "matricNumber-error" : undefined} {...register("matricNumber")} />
        <InlineFieldError id="matricNumber-error" message={errors.matricNumber?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="academicSession">Academic Session</Label>
        <Input id="academicSession" placeholder="e.g. 2023/2024" aria-invalid={Boolean(errors.academicSession)} aria-describedby={errors.academicSession ? "academicSession-error" : undefined} {...register("academicSession")} />
        <InlineFieldError id="academicSession-error" message={errors.academicSession?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select value={department || undefined} onValueChange={(value) => setValue("department", value, { shouldValidate: true, shouldDirty: true })}>
          <SelectTrigger id="department" aria-invalid={Boolean(errors.department)} aria-describedby={errors.department ? "department-error" : undefined}><SelectValue placeholder="Select department" /></SelectTrigger>
          <SelectContent>{departmentOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
        </Select>
        <InlineFieldError id="department-error" message={errors.department?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="level">Level</Label>
        <Select value={level || undefined} onValueChange={(value) => setValue("level", value, { shouldValidate: true, shouldDirty: true })}>
          <SelectTrigger id="level" aria-invalid={Boolean(errors.level)} aria-describedby={errors.level ? "level-error" : undefined}><SelectValue placeholder="Select level" /></SelectTrigger>
          <SelectContent>{levelOptions.map((option) => <SelectItem key={option} value={option}>Level {option}</SelectItem>)}</SelectContent>
        </Select>
        <InlineFieldError id="level-error" message={errors.level?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester">Semester</Label>
        <Select value={semester || undefined} onValueChange={(value) => setValue("semester", value, { shouldValidate: true, shouldDirty: true })}>
          <SelectTrigger id="semester" aria-invalid={Boolean(errors.semester)} aria-describedby={errors.semester ? "semester-error" : undefined}><SelectValue placeholder="Select semester" /></SelectTrigger>
          <SelectContent>{semesterOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
        </Select>
        <InlineFieldError id="semester-error" message={errors.semester?.message} />
      </div>
    </div>
  )
}
