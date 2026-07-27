import { useState } from "react"
import { Plus } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { COURSE_LIBRARY, type CourseTemplate } from "@/features/calculator/data/courses"

interface AddCourseButtonProps {
  onSelectCourse: (course: CourseTemplate) => void
  addedCourseCodes?: string[]
}

export function AddCourseButton({
  onSelectCourse,
  addedCourseCodes = [],
}: AddCourseButtonProps) {
  const [open, setOpen] = useState(false)

  const availableCourses = COURSE_LIBRARY.filter(
    (course) => !addedCourseCodes.includes(course.code),
  )

  return (
    <Select 
      open={open}
      onOpenChange={setOpen}
      value=""
      onValueChange={(value) => {
        const course = COURSE_LIBRARY.find((c) => c.code === value)
        if (course) {
          onSelectCourse(course)
        }
        setOpen(false)
      }}
    >
      <SelectTrigger 
        className="flex h-10 w-auto items-center gap-2 rounded-md border-none bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600 focus:ring-0 focus:ring-offset-0 [&>svg]:hidden"
      >
        <Plus className="h-4 w-4" />
        Add Course
      </SelectTrigger>
      <SelectContent align="end" className="max-h-[300px] w-[350px]">
        {availableCourses.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-gray-500">
            All available courses have been added.
          </div>
        ) : (
          availableCourses.map((course) => (
            <SelectItem key={course.code} value={course.code}>
              <div className="flex flex-col items-start py-1">
                <span className="text-sm font-bold text-gray-900">
                  {course.code}
                </span>
                <span className="text-xs text-gray-500">{course.title}</span>
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
