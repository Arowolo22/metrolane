import { ArrowLeft, Pencil, Printer } from "lucide-react"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { ErrorState, SkeletonLoader } from "@/components/states"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AcademicRemarks } from "@/features/result-sheet/components/AcademicRemarks"
import { Footer } from "@/features/result-sheet/components/Footer"
import { InstitutionHeader } from "@/features/result-sheet/components/InstitutionHeader"
import { SemesterSummary } from "@/features/result-sheet/components/SemesterSummary"
import { SignatureSection } from "@/features/result-sheet/components/SignatureSection"
import { StudentInformationCard } from "@/features/result-sheet/components/StudentInformationCard"
import type { ResultSheetSummary } from "@/features/result-sheet/types"
import { StatusBadge } from "@/features/student-records/components/StatusBadge"
import { useStudentRecordQuery, studentRecordQueryKey } from "@/features/student-records/hooks/useStudentRecordQuery"
import { updateResultStatus } from "@/features/student-records/services/studentRecordsService"
import type { ResultDetail, ResultStatus } from "@/features/student-records/types"
import { classifyApiError, ResilienceError } from "@/lib/apiErrors"
import { notifyError, notifySuccess } from "@/lib/notifications"
import { queryClient } from "@/lib/queryClient"

const statusOptions: ResultStatus[] = ["Generated", "Pending", "Approved", "Rejected"]

function toResultSheetSummary(summary: ResultDetail["summary"]): ResultSheetSummary {
  return {
    totalCourses: summary.totalCourses,
    totalCreditUnits: summary.totalCreditUnits,
    totalGradePoints: summary.totalQualityPoints.toFixed(2),
    semesterGpa: summary.semesterGpa.toFixed(2),
    cumulativeGpa: summary.cumulativeGpa !== null ? summary.cumulativeGpa.toFixed(2) : "—",
    academicStanding: summary.academicStanding,
    degreeClassification: summary.degreeClassification,
    academicRemarks: summary.academicRemarks,
  }
}

export function StudentRecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const shouldPrint = searchParams.get("print") === "1"
  const query = useStudentRecordQuery(id)
  const record = query.data

  const statusMutation = useMutation({
    mutationFn: ({ recordId, status }: { recordId: string; status: ResultStatus }) =>
      updateResultStatus(recordId, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(studentRecordQueryKey(updated.id), updated)
      notifySuccess("Result status updated")
    },
    onError: (error) => notifyError(error, "Failed to update status."),
  })

  useEffect(() => {
    if (!shouldPrint || !record || query.isLoading) return
    const timer = window.setTimeout(() => window.print(), 300)
    return () => window.clearTimeout(timer)
  }, [shouldPrint, record, query.isLoading])

  function handleStatusChange(status: ResultStatus) {
    if (!record) return
    statusMutation.mutate({ recordId: record.id, status })
  }

  if (query.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between"><SkeletonLoader variant="navigation" rows={2} className="w-40" /><SkeletonLoader variant="navigation" rows={1} className="w-32" /></div>
        <SkeletonLoader variant="profile" />
        <SkeletonLoader variant="table" rows={6} />
      </div>
    )
  }

  if (query.isError || !record) {
    const detailError = query.error ?? new ResilienceError({
      kind: "notFound",
      message: "Result not found",
      retryable: false,
    })
    return (
      <ErrorState
        error={detailError}
        onRetry={detailError.retryable ? () => void query.refetch() : undefined}
        attempt={query.failureCount + 1}
        maxAttempts={3}
        onGoHome={() => navigate("/student-records")}
        onContactSupport={detailError ? () => notifyError(detailError, `Reference ${detailError.errorId}`) : undefined}
      />
    )
  }

  const summary = toResultSheetSummary(record.summary)
  const generatedAt = new Date(record.generatedAt)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button variant="outline" onClick={() => navigate("/student-records")}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={record.status} />
          <Select value={record.status} disabled={statusMutation.isPending} onValueChange={(value) => handleStatusChange(value as ResultStatus)}>
            <SelectTrigger className="w-40 print:hidden" aria-label="Update result status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => navigate(`/calculator?editId=${record.id}`)}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print
          </Button>
        </div>
      </div>

      {statusMutation.isError ? (
        <ErrorState
          error={classifyApiError(statusMutation.error, "Failed to update status.")}
          compact
          onRetry={() => handleStatusChange(record.status)}
          onContactSupport={() => notifyError(statusMutation.error, "Status update failed.")}
          className="print:hidden"
        />
      ) : null}

      <article className="mx-auto w-full max-w-[210mm] space-y-6 bg-white p-4 shadow-lg sm:p-8 print:shadow-none">
        <InstitutionHeader photoUrl={record.student.photoUrl} />
        <StudentInformationCard student={record.student} generatedAt={generatedAt} />

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Academic Record</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-orange-500 hover:bg-orange-500">
                  {['Course Code', 'Course Title', 'Credit Unit', 'CA', 'Exam', 'Total', 'Grade', 'GP'].map((heading) => <TableHead key={heading} className="text-white">{heading}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.courses.map((course) => (
                  <TableRow key={course.courseCode}>
                    <TableCell className="font-semibold text-orange-600">{course.courseCode}</TableCell>
                    <TableCell>{course.courseTitle}</TableCell>
                    <TableCell>{course.creditUnit}</TableCell>
                    <TableCell>{course.continuousAssessment}</TableCell>
                    <TableCell>{course.examinationScore}</TableCell>
                    <TableCell>{course.total}</TableCell>
                    <TableCell>{course.grade}</TableCell>
                    <TableCell>{course.gradePoint.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <SemesterSummary summary={summary} />

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">CGPA Summary</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-medium uppercase tracking-wide text-gray-500">Semester GPA</p><p className="mt-2 text-3xl font-bold text-orange-500">{summary.semesterGpa}</p></div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-xs font-medium uppercase tracking-wide text-gray-500">Cumulative GPA (CGPA)</p><p className="mt-2 text-3xl font-bold text-gray-900">{summary.cumulativeGpa}</p><p className="mt-3 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">Academic Standing: {summary.academicStanding}</p></div>
            <div className="rounded-xl bg-orange-500 p-5 text-white shadow-md"><p className="text-xs font-medium uppercase tracking-wide text-orange-100">Degree Classification</p><p className="mt-2 text-xl font-bold leading-tight">{summary.degreeClassification}</p></div>
          </div>
        </section>

        <AcademicRemarks remarks={summary.academicRemarks} />
        <SignatureSection />
        <Footer generatedAt={generatedAt} />
      </article>
    </div>
  )
}
