import { useCallback, useState } from "react"

import type { CourseRecord } from "@/features/calculator/types"
import { createEmptyCourse } from "@/features/calculator/types"
import type { CourseTemplate } from "@/features/calculator/data/courses"

export function useCourseRegister() {
  const [courses, setCourses] = useState<CourseRecord[]>([])

  const addCourse = useCallback(() => {
    setCourses((prev) => [...prev, createEmptyCourse()])
  }, [])

  const addCourseFromTemplate = useCallback((template: CourseTemplate) => {
    setCourses((prev) => [
      ...prev,
      {
        ...createEmptyCourse(),
        courseCode: template.code,
        courseTitle: template.title,
        creditUnit: template.creditUnit,
        isEditing: true,
      },
    ])
  }, [])

  const updateCourse = useCallback(
    (id: string, updates: Partial<CourseRecord>) => {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === id ? { ...course, ...updates } : course,
        ),
      )
    },
    [],
  )

  const deleteCourse = useCallback((id: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== id))
  }, [])

  const toggleEdit = useCallback((id: string, isEditing: boolean) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id ? { ...course, isEditing } : course,
      ),
    )
  }, [])

  const savedCourseCount = courses.filter((course) => !course.isEditing).length

  return {
    courses,
    savedCourseCount,
    addCourse,
    addCourseFromTemplate,
    updateCourse,
    deleteCourse,
    toggleEdit,
  }
}
