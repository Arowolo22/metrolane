import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { X } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ErrorState, SkeletonLoader } from "@/components/states"
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
import { fetchResultById, updateResultRecord } from "@/features/student-records/services/studentRecordsService"
import { classifyApiError, type ResilienceError } from "@/lib/apiErrors"
import { notifyInfo } from "@/lib/notifications"
import { useFocusFirstError } from "@/hooks/useFocusFirstError"

interface StudentPrefill {
  studentName: string
  matricNumber: string
  currentGpa?: string
  photoUrl?: string
}

export function CalculatorPage() {
  const [searchParams] = useSearchParams()
  const editId = searchParams.get("editId")
  const location = useLocation()
  const navigate = useNavigate()

  const studentForm = useForm<StudentInformationFormValues>({
    resolver: zodResolver(studentInformationSchema),
    defaultValues: EMPTY_STUDENT_INFORMATION,
    mode: "onChange",
  })

  const { courses, savedCourseCount, addCourseFromTemplate, updateCourse, deleteCourse, toggleEdit, loadCourses } = useCourseRegister()
  const [editStudentName, setEditStudentName] = useState<string | null>(null)
  const [isLoadingRecord, setIsLoadingRecord] = useState(false)
  const [editLoadError, setEditLoadError] = useState<ResilienceError | null>(null)
  const [editReloadKey, setEditReloadKey] = useState(0)
  const [hasAttemptedGenerate, setHasAttemptedGenerate] = useState(false)

  useFocusFirstError(studentForm.formState.errors, hasAttemptedGenerate)

  useEffect(() => {
    if (!editId) return
    let cancelled = false
    // The request lifecycle intentionally resets the view state before fetching.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoadingRecord(true)
    setEditLoadError(null)

    fetchResultById(editId)
      .then((record) => {
        if (cancelled) return
        studentForm.reset({
          studentName: record.student.studentName,
          matricNumber: record.student.matricNumber,
          faculty: record.student.faculty ?? "",
          department: record.student.department,
          programme: record.student.programme ?? "",
          level: record.student.level,
          semester: record.student.semester,
          academicSession: record.student.academicSession,
          currentGpa: record.student.currentGpa ?? "",
          totalCreditUnits: record.student.totalCreditUnits ?? "",
          photoUrl: record.student.photoUrl,
        })
        loadCourses(record.courses.map((course) => ({
          id: crypto.randomUUID(),
          courseCode: course.courseCode,
          courseTitle: course.courseTitle,
          creditUnit: String(course.creditUnit),
          continuousAssessment: String(course.continuousAssessment),
          examinationScore: String(course.examinationScore),
          isEditing: false,
        })))
        setEditStudentName(record.student.studentName)
      })
      .catch((error) => {
        if (!cancelled) setEditLoadError(classifyApiError(error, "Failed to load result for editing."))
      })
      .finally(() => {
        if (!cancelled) setIsLoadingRecord(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, editReloadKey])

  useEffect(() => {
    if (editId) return
    const prefill = (location.state as { prefillStudent?: StudentPrefill } | null)?.prefillStudent
    if (!prefill) return

    studentForm.reset({
      ...EMPTY_STUDENT_INFORMATION,
      studentName: prefill.studentName,
      matricNumber: prefill.matricNumber,
      currentGpa: prefill.currentGpa ?? "",
      photoUrl: prefill.photoUrl,
    })
    navigate(location.pathname, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, location.state])

  const { generateResult, isGenerating, validationErrors } = useResultGenerator({
    onPersist: editId ? (payload) => updateResultRecord(editId, payload) : persistGeneratedResult,
  })

  const handleGenerateResult = async () => {
    setHasAttemptedGenerate(true)
    const isValid = await studentForm.trigger(undefined, { shouldFocus: true })
    if (!isValid) {
      notifyInfo("Review the highlighted fields", "Complete the required student details before generating.")
      return
    }

    const success = await generateResult(studentForm.getValues(), courses)
    if (success && editId) navigate(`/student-records/${editId}`)
  }

  if (editId && isLoadingRecord) {
    return (
      <div className="space-y-8">
        <SkeletonLoader variant="form" />
        <SkeletonLoader variant="table" rows={5} />
      </div>
    )
  }

  if (editId && editLoadError) {
    return <ErrorState error={editLoadError} onRetry={() => setEditReloadKey((value) => value + 1)} onGoHome={() => navigate("/student-records")} />
  }

  return (
    <div className="space-y-8">
      {editId ? (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3 text-orange-800">
            <span>Editing result{editStudentName ? ` for ${editStudentName}` : ""}. Update the details below and generate the result again to save your changes.</span>
            <Button type="button" variant="outline" size="sm" onClick={() => navigate("/student-records")}><X className="h-4 w-4" aria-hidden="true" />Cancel Edit</Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <FormProvider {...studentForm}>
          <StudentInformationCard />
          <GPASummaryCard />
        </FormProvider>
      </section>

      <section><CourseAssessmentTable courses={courses} onAddCourse={addCourseFromTemplate} onUpdateCourse={updateCourse} onDeleteCourse={deleteCourse} onToggleEdit={toggleEdit} /></section>

      <section className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3"><CreditLoadCard courses={courses} /><GradePointCard courses={courses} /><SemesterGPACard courses={courses} /></div>
        {validationErrors.length > 0 ? <Alert variant="destructive"><AlertTitle>Please complete the following before generating</AlertTitle><AlertDescription><ul className="mt-2 list-disc space-y-1 pl-4">{validationErrors.map((error) => <li key={error}>{error}</li>)}</ul></AlertDescription></Alert> : null}
        <GenerateResultButton disabled={savedCourseCount === 0} isLoading={isGenerating} onGenerate={handleGenerateResult} label={editId ? "Update Result" : "Generate Result"} loadingLabel={editId ? "Updating..." : "Generating..."} />
      </section>
    </div>
  )
}
