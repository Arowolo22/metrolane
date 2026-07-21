import { GPASummaryCard } from "@/features/calculator/components/GPASummaryCard"
import { StudentInformationCard } from "@/features/calculator/components/StudentInformationCard"
import { CourseAssessmentTable } from "@/features/calculator/components/CourseAssessmentTable"
import { CreditLoadCard } from "@/features/calculator/components/CreditLoadCard"
import { GradePointCard } from "@/features/calculator/components/GradePointCard"
import { SemesterGPACard } from "@/features/calculator/components/SemesterGPACard"
import { GenerateResultButton } from "@/features/calculator/components/GenerateResultButton"
import { useCourseRegister } from "@/features/calculator/hooks/useCourseRegister"

export function CalculatorPage() {
  const {
    courses,
    savedCourseCount,
    addCourseFromTemplate,
    updateCourse,
    deleteCourse,
    toggleEdit,
  } = useCourseRegister()

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <StudentInformationCard />
        <GPASummaryCard />
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
          <CreditLoadCard />
          <GradePointCard />
          <SemesterGPACard />
        </div>
        <GenerateResultButton disabled={savedCourseCount === 0} />
      </section>
    </div>
  )
}
