import { useState } from "react"
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
import { lookupStudentForCalculator } from "@/features/student-records/services/studentRecordsService"
import { classifyApiError } from "@/lib/apiErrors"
import { notifyError, notifySuccess } from "@/lib/notifications"

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
  const [isLookingUp, setIsLookingUp] = useState(false)

  const department = watch("department")
  const level = watch("level")
  const semester = watch("semester")

  async function lookupByName() {
    const studentName = watch("studentName")?.trim()
    if (!studentName || isLookingUp) return

    setIsLookingUp(true)
    try {
      const prefill = await lookupStudentForCalculator(studentName)
      setValue("studentName", prefill.studentName, { shouldValidate: true, shouldDirty: true })
      setValue("matricNumber", prefill.matricNumber, { shouldValidate: true, shouldDirty: true })
      setValue("department", prefill.department, { shouldValidate: true, shouldDirty: true })
      setValue("faculty", prefill.faculty ?? "", { shouldDirty: true })
      setValue("programme", prefill.programme ?? "", { shouldDirty: true })
      setValue("level", prefill.level, { shouldValidate: true, shouldDirty: true })
      setValue("academicSession", prefill.academicSession, { shouldValidate: true, shouldDirty: true })
      setValue("currentGpa", prefill.currentGpa, { shouldValidate: true, shouldDirty: true })
      setValue("totalCreditUnits", prefill.totalCreditUnits, { shouldValidate: true, shouldDirty: true })
      if (prefill.photoUrl) {
        setValue("photoUrl", prefill.photoUrl, { shouldDirty: true })
      }
      if (!semester) {
        setValue("semester", prefill.semester ?? "Second Semester", {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      notifySuccess(`Loaded first semester GPA ${prefill.currentGpa} for ${prefill.studentName}.`)
    } catch (error) {
      notifyError(
        classifyApiError(error, "No saved first semester result was found for that name."),
        "Student lookup failed.",
      )
    } finally {
      setIsLookingUp(false)
    }
  }

  return (
    <div className="grid flex-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="studentName">Student Name</Label>
        <Input
          id="studentName"
          placeholder="Type the student name and press Enter to load Current GPA"
          aria-invalid={Boolean(errors.studentName)}
          aria-describedby={errors.studentName ? "studentName-error" : undefined}
          {...register("studentName")}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return
            event.preventDefault()
            void lookupByName()
          }}
        />
        <p className="text-xs text-gray-500">
          {isLookingUp
            ? "Looking up first semester GPA…"
            : "Press Enter after typing the name to fetch the saved Current GPA."}
        </p>
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
