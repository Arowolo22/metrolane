interface AcademicRemarksProps {
  remarks: string
}

export function AcademicRemarks({ remarks }: AcademicRemarksProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Academic Remarks
      </h2>
      <p className="mt-3 text-sm text-gray-700">{remarks}</p>
    </section>
  )
}
