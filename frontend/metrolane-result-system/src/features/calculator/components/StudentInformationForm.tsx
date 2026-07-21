import { useFormContext } from "react-hook-form"

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

const programmeOptions = [
  "Community Health",
  "Medical Laboratory Science",
  "Health Information Management",
  "Public Health",
  "Environmental Health",
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

  const programme = watch("programme")
  const level = watch("level")
  const semester = watch("semester")

  return (
    <div className="grid flex-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="studentName">Student Name</Label>
        <Input
          id="studentName"
          placeholder="Enter student full name"
          {...register("studentName")}
        />
        {errors.studentName && (
          <p className="text-xs text-red-500">{errors.studentName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="matricNumber">Matric Number</Label>
        <Input
          id="matricNumber"
          placeholder="Enter matric number"
          {...register("matricNumber")}
        />
        {errors.matricNumber && (
          <p className="text-xs text-red-500">{errors.matricNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="programme">Programme</Label>
        <Select
          value={programme || undefined}
          onValueChange={(value) =>
            setValue("programme", value, { shouldValidate: true })
          }
        >
          <SelectTrigger id="programme">
            <SelectValue placeholder="Select programme" />
          </SelectTrigger>
          <SelectContent>
            {programmeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.programme && (
          <p className="text-xs text-red-500">{errors.programme.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="level">Level</Label>
        <Select
          value={level || undefined}
          onValueChange={(value) =>
            setValue("level", value, { shouldValidate: true })
          }
        >
          <SelectTrigger id="level">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {levelOptions.map((option) => (
              <SelectItem key={option} value={option}>
                Level {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.level && (
          <p className="text-xs text-red-500">{errors.level.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester">Semester</Label>
        <Select
          value={semester || undefined}
          onValueChange={(value) =>
            setValue("semester", value, { shouldValidate: true })
          }
        >
          <SelectTrigger id="semester">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semesterOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.semester && (
          <p className="text-xs text-red-500">{errors.semester.message}</p>
        )}
      </div>
    </div>
  )
}
