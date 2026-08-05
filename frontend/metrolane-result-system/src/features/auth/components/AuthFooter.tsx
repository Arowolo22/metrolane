export function AuthFooter() {
  return (
    <footer className="space-y-3 border-t border-gray-100 pt-6 text-center lg:text-left">
      <p className="text-xs text-gray-400">
        Lecturer and authorized academic staff access only. Student accounts are
        not permitted on this portal.
      </p>
      {/* <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-400 lg:justify-start">
        <span className="inline-flex items-center gap-1">
          <Shield className="h-3 w-3" aria-hidden />
          Session timeout (backend)
        </span>
        <span aria-hidden>·</span>
        <span>Account lockout policy (backend)</span>
        <span aria-hidden>·</span>
        <span>Two-factor authentication (optional, future)</span>
      </div> */}
    </footer>
  )
}
