const signatureRoles = [
  "Examination Officer",
  "Head of Department",
  "Registrar",
] as const

export function SignatureSection() {
  return (
    <section>
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Signatures
      </h2>
      <div className="grid gap-8 sm:grid-cols-3">
        {signatureRoles.map((role) => (
          <div key={role} className="space-y-10">
            <div className="border-b border-gray-400" />
            <p className="text-center text-sm font-medium text-gray-700">{role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
