import { ArrowLeft, Loader2, Pencil, Printer } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  fetchResultById,
  updateResultStatus,
} from "@/features/student-records/services/studentRecordsService"
import type { ResultDetail, ResultStatus } from "@/features/student-records/types"
import { getApiErrorMessage } from "@/lib/api"

const statusOptions: ResultStatus[] = ["Generated", "Pending", "Approved", "Rejected"]

function toResultSheetSummary(summary: ResultDetail["summary"]): ResultSheetSummary {
  return {
    totalCourses: summary.totalCourses,
    totalCreditUnits: summary.totalCreditUnits,
    totalGradePoints: summary.totalQualityPoints.toFixed(2),
    semesterGpa: summary.semesterGpa.toFixed(2),
    cumulativeGpa:
      summary.cumulativeGpa !== null ? summary.cumulativeGpa.toFixed(2) : "—",
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

  const [record, setRecord] = useState<ResultDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    // Reset loading/error whenever the record id changes, before the fetch resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    setError(null)

    fetchResultById(id)
      .then((data) => {
        if (!cancelled) setRecord(data)
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, "Failed to load result."))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!shouldPrint || !record || isLoading) return
    const timer = window.setTimeout(() => window.print(), 300)
    return () => window.clearTimeout(timer)
  }, [shouldPrint, record, isLoading])

  async function handleStatusChange(status: ResultStatus) {
    if (!record) return
    setIsUpdatingStatus(true)
    setError(null)
    try {
      const updated = await updateResultStatus(record.id, status)
      setRecord(updated)
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update status."))
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    )
  }

  if (error && !record) {
    return (
      <Card>
        <CardContent className="p-8">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/student-records")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Student Records
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!record) return null

  const summary = toResultSheetSummary(record.summary)
  const generatedAt = new Date(record.generatedAt)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button variant="outline" onClick={() => navigate("/student-records")}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={record.status} />
          <Select
            value={record.status}
            disabled={isUpdatingStatus}
            onValueChange={(value) => handleStatusChange(value as ResultStatus)}
          >
            <SelectTrigger className="w-40 print:hidden">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => navigate(`/calculator?editId=${record.id}`)}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive" className="print:hidden">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <article className="mx-auto w-full max-w-[210mm] space-y-6 bg-white p-8 shadow-lg print:shadow-none">
        <InstitutionHeader photoUrl={record.student.photoUrl} />
        <StudentInformationCard student={record.student} generatedAt={generatedAt} />

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Academic Record
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-orange-500 hover:bg-orange-500">
                  <TableHead className="text-white">Course Code</TableHead>
                  <TableHead className="text-white">Course Title</TableHead>
                  <TableHead className="text-white">Credit Unit</TableHead>
                  <TableHead className="text-white">CA</TableHead>
                  <TableHead className="text-white">Exam</TableHead>
                  <TableHead className="text-white">Total</TableHead>
                  <TableHead className="text-white">Grade</TableHead>
                  <TableHead className="text-white">GP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.courses.map((course) => (
                  <TableRow key={course.courseCode}>
                    <TableCell className="font-semibold text-orange-600">
                      {course.courseCode}
                    </TableCell>
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
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            CGPA Summary
          </h2>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Semester GPA
              </p>
              <p className="mt-2 text-3xl font-bold text-orange-500">
                {summary.semesterGpa}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Cumulative GPA (CGPA)
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {summary.cumulativeGpa}
              </p>
              <p className="mt-3 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                Academic Standing: {summary.academicStanding}
              </p>
            </div>
            <div className="rounded-xl bg-orange-500 p-5 text-white shadow-md">
              <p className="text-xs font-medium uppercase tracking-wide text-orange-100">
                Degree Classification
              </p>
              <p className="mt-2 text-xl font-bold leading-tight">
                {summary.degreeClassification}
              </p>
            </div>
          </div>
        </section>

        <AcademicRemarks remarks={summary.academicRemarks} />
        <SignatureSection />
        <Footer generatedAt={generatedAt} />
      </article>
    </div>
  )
}
