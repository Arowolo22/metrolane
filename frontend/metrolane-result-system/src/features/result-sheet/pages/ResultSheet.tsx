import type { CourseRecord } from "@/features/calculator/types"
import type { StudentInformationFormValues } from "@/features/calculator/utils/validation"
import { buildResultSummary } from "@/features/result-sheet/utils/resultHelpers"

import { AcademicRecordTable } from "../components/AcademicRecordTable"
import { AcademicRemarks } from "../components/AcademicRemarks"
import { CGPASummary } from "../components/CGPASummary"
import { Footer } from "../components/Footer"
import { InstitutionHeader } from "../components/InstitutionHeader"
import { SemesterSummary } from "../components/SemesterSummary"
import { SignatureSection } from "../components/SignatureSection"
import { StudentInformationCard } from "../components/StudentInformationCard"

interface ResultSheetProps {
  student: StudentInformationFormValues
  courses: CourseRecord[]
  generatedAt?: Date
}

export function ResultSheet({
  student,
  courses,
  generatedAt = new Date(),
}: ResultSheetProps) {
  const summary = buildResultSummary(courses)

  return (
    <article className="mx-auto w-full max-w-[210mm] space-y-6 bg-white p-8 shadow-lg">
      <InstitutionHeader photoUrl={student.photoUrl} />
      <StudentInformationCard student={student} generatedAt={generatedAt} />
      <AcademicRecordTable courses={courses} />
      <SemesterSummary summary={summary} />
      <CGPASummary summary={summary} />
      <AcademicRemarks remarks={summary.academicRemarks} />
      <SignatureSection />
      <Footer generatedAt={generatedAt} />
    </article>
  )
}
