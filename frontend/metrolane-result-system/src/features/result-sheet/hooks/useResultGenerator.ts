import { useCallback, useState } from "react"
import { toast } from "sonner"

import type { CourseRecord } from "@/features/calculator/types"
import type { StudentInformationFormValues } from "@/features/calculator/utils/validation"

import {
  downloadResultPdf,
  generateResultPdf,
} from "../services/generateResultPdf"
import type { ResultPersistenceAdapter, SaveResultRecordPayload } from "../types"
import { buildResultSummary, getSavedCourses } from "../utils/resultHelpers"
import { validateResultGeneration } from "../utils/validation"

interface UseResultGeneratorOptions {
  onPersist?: ResultPersistenceAdapter
}

export function useResultGenerator(options: UseResultGeneratorOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const generateResult = useCallback(
    async (
      student: StudentInformationFormValues,
      courses: CourseRecord[],
    ) => {
      const validation = validateResultGeneration(student, courses)
      if (!validation.success) {
        setValidationErrors(validation.errors)
        toast.error("Unable to generate result", {
          description: validation.errors[0],
        })
        return false
      }

      setValidationErrors([])
      setIsGenerating(true)

      try {
        const savedCourses = getSavedCourses(courses)
        const summary = buildResultSummary(savedCourses)
        const generatedAt = new Date()

        const { blob, filename } = await generateResultPdf({
          student,
          courses: savedCourses,
          summary,
          generatedAt,
        })

        downloadResultPdf(blob, filename)

        const payload: SaveResultRecordPayload = {
          student,
          courses: savedCourses.map(({ isEditing: _isEditing, ...course }) => course),
          generatedAt: generatedAt.toISOString(),
          filename,
        }

        if (options.onPersist) {
          await options.onPersist(payload)
        }

        toast.success("Result generated and downloaded successfully.")
        return true
      } catch (error) {
        console.error("PDF generation failed", error)
        toast.error("PDF generation failed", {
          description:
            error instanceof Error
              ? error.message
              : "Please try again or contact support.",
        })
        return false
      } finally {
        setIsGenerating(false)
      }
    },
    [options.onPersist],
  )

  return {
    generateResult,
    isGenerating,
    validationErrors,
    clearValidationErrors: () => setValidationErrors([]),
  }
}
