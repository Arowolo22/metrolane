import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GPASummaryCard } from "@/features/calculator/components/GPASummaryCard"
import { StudentInformationCard } from "@/features/calculator/components/StudentInformationCard"
import { CourseAssessmentTable } from "@/features/calculator/components/CourseAssessmentTable"
import { CreditLoadCard } from "@/features/calculator/components/CreditLoadCard"
import { GradePointCard } from "@/features/calculator/components/GradePointCard"
import { SemesterGPACard } from "@/features/calculator/components/SemesterGPACard"
import { GenerateResultButton } from "@/features/calculator/components/GenerateResultButton"
import { useCourseRegister } from "@/features/calculator/hooks/useCourseRegister"
import { EMPTY_STUDENT_INFORMATION } from "@/features/calculator/types"
import {
  studentInformationSchema,
  type StudentInformationFormValues,
} from "@/features/calculator/utils/validation"
import { useResultGenerator } from "@/features/result-sheet/hooks/useResultGenerator"
import { persistGeneratedResult } from "@/features/result-sheet/services/resultPersistence"

export function CalculatorPage() {
  const studentForm = useForm<StudentInformationFormValues>({
    resolver: zodResolver(studentInformationSchema),
    defaultValues: EMPTY_STUDENT_INFORMATION,
    mode: "onChange",
  })

  const {
    courses,
    savedCourseCount,
    addCourseFromTemplate,
    updateCourse,
    deleteCourse,
    toggleEdit,
  } = useCourseRegister()

  const { generateResult, isGenerating, validationErrors } = useResultGenerator({
    onPersist: persistGeneratedResult,
  })

  const handleGenerateResult = async () => {
    await generateResult(studentForm.getValues(), courses)
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <FormProvider {...studentForm}>
          <StudentInformationCard />
          <GPASummaryCard />
        </FormProvider>
      </section>

      <section>
        <CourseAssessmentTable
          courses={courses}
          onAddCourse={addCourseFromTemplate}
          onUpdateCourse={updateCourse}
          onDeleteCourse={deleteCourse}
          onToggleEdit={toggleEdit}
        />
      </section>

      <section className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <CreditLoadCard courses={courses} />
          <GradePointCard courses={courses} />
          <SemesterGPACard courses={courses} />
        </div>

        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertTitle>Please complete the following before generating</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <GenerateResultButton
          disabled={savedCourseCount === 0}
          isLoading={isGenerating}
          onGenerate={handleGenerateResult}
        />
      </section>
    </div>
  )
}
