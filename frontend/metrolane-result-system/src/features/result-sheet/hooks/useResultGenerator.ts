import { useCallback, useState } from "react"

import type { CourseRecord } from "@/features/calculator/types"
import type { StudentInformationFormValues } from "@/features/calculator/utils/validation"
import { classifyApiError } from "@/lib/apiErrors"
import { notifyError, notifySuccess } from "@/lib/notifications"

import { downloadResultPdf, generateResultPdf } from "../services/generateResultPdf"
import type { ResultPersistenceAdapter, SaveResultRecordPayload } from "../types"
import { buildResultSummary, getSavedCourses } from "../utils/resultHelpers"
import { validateResultGeneration } from "../utils/validation"

interface UseResultGeneratorOptions {
  onPersist?: ResultPersistenceAdapter
}

export function useResultGenerator(options: UseResultGeneratorOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const onPersist = options.onPersist

  const generateResult = useCallback(
    async (student: StudentInformationFormValues, courses: CourseRecord[]) => {
      const validation = validateResultGeneration(student, courses)
      if (!validation.success) {
        setValidationErrors(validation.errors)
        notifyError(new Error(validation.errors[0]), "Unable to generate result.")
        return false
      }

      setValidationErrors([])
      setIsGenerating(true)

      try {
        const savedCourses = getSavedCourses(courses)
        const summary = buildResultSummary(savedCourses)
        const generatedAt = new Date()
        const { blob, filename } = await generateResultPdf({ student, courses: savedCourses, summary, generatedAt })
        downloadResultPdf(blob, filename)

        const payload: SaveResultRecordPayload = {
          student,
          courses: savedCourses.map((course) =>
            Object.fromEntries(
              Object.entries(course).filter(([key]) => key !== "isEditing"),
            ) as SaveResultRecordPayload["courses"][number],
          ),
          generatedAt: generatedAt.toISOString(),
          filename,
        }

        if (onPersist) await onPersist(payload)
        notifySuccess("Result generated and downloaded successfully.")
        return true
      } catch (error) {
        const normalized = classifyApiError(error, "We couldn’t generate the PDF. Please try again or contact support.")
        notifyError(normalized, "Result generation failed.")
        return false
      } finally {
        setIsGenerating(false)
      }
    },
    [onPersist],
  )

  return {
    generateResult,
    isGenerating,
    validationErrors,
    clearValidationErrors: () => setValidationErrors([]),
  }
}
