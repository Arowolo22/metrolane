import type { CourseRecord } from "@/features/calculator/types"
import type { StudentInformationFormValues } from "@/features/calculator/utils/validation"
import { buildResultSummary } from "@/features/result-sheet/utils/resultHelpers"

import { AcademicRecordTable } from "./AcademicRecordTable"
import { AcademicRemarks } from "./AcademicRemarks"
import { CGPASummary } from "./CGPASummary"
import { Footer } from "./Footer"
import { InstitutionHeader } from "./InstitutionHeader"
import { SemesterSummary } from "./SemesterSummary"
import { SignatureSection } from "./SignatureSection"
import { StudentInformationCard } from "./StudentInformationCard"

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
      <InstitutionHeader />
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
