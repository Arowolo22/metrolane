import { Bell, Loader2, Menu, Search, UserCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { RetryButton } from "@/components/states"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/context/useAuth"
import { useStudentRecordsQuery } from "@/features/student-records/hooks/useStudentRecordsQuery"
import { fetchResultById } from "@/features/student-records/services/studentRecordsService"
import type { StudentRecord } from "@/features/student-records/types"
import { classifyApiError, type ResilienceError } from "@/lib/apiErrors"
import { notifyError } from "@/lib/notifications"

interface TopNavigationProps {
  title: string
  onMenuClick?: () => void
}

function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

const MAX_RESULTS = 6

export function TopNavigation({ title, onMenuClick }: TopNavigationProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionError, setSelectionError] = useState<ResilienceError | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchQuery = useStudentRecordsQuery(
    { search: query },
    { enabled: query.trim().length >= 2 },
  )
  const results = (searchQuery.data ?? []).slice(0, MAX_RESULTS)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleSelectStudent(record: StudentRecord) {
    setIsSelecting(true)
    setSelectionError(null)
    try {
      const detail = await fetchResultById(record.id)
      setIsOpen(false)
      setQuery("")
      navigate("/calculator", {
        state: {
          prefillStudent: {
            studentName: detail.student.studentName,
            matricNumber: detail.student.matricNumber,
            currentGpa: detail.student.currentGpa,
            photoUrl: detail.student.photoUrl,
          },
        },
      })
    } catch (error) {
      const normalized = classifyApiError(error, "We couldn’t open that result.")
      setSelectionError(normalized)
      notifyError(normalized, "We couldn’t open that result.")
    } finally {
      setIsSelecting(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open navigation menu">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">{title}</h1>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div ref={containerRef} className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                const nextQuery = event.target.value
                setQuery(nextQuery)
                setSelectionError(null)
                setIsOpen(nextQuery.trim().length >= 2)
              }}
              onFocus={() => {
                if (query.trim().length >= 2) setIsOpen(true)
              }}
              placeholder="Search student by name or matric number..."
              role="combobox"
              aria-label="Search students"
              aria-expanded={isOpen}
              aria-controls="student-search-results"
              aria-autocomplete="list"
              className="h-10 w-56 rounded-lg border border-gray-300 bg-gray-50 pl-9 pr-9 text-sm text-gray-700 placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 lg:w-72"
            />
            {searchQuery.isFetching ? <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" aria-label="Searching" /> : null}

            {isOpen && query.trim().length >= 2 ? (
              <div id="student-search-results" className="absolute right-0 top-12 z-40 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg" role="listbox">
                {searchQuery.isError ? (
                  <div className="space-y-3 p-4" role="alert">
                    <p className="text-sm font-medium text-red-900">Search is temporarily unavailable.</p>
                    <RetryButton onRetry={() => void searchQuery.refetch()} attempt={searchQuery.failureCount + 1} maxAttempts={3} />
                  </div>
                ) : selectionError ? (
                  <div className="space-y-3 p-4" role="alert">
                    <p className="text-sm font-medium text-red-900">Couldn’t open this record.</p>
                    <RetryButton onRetry={() => setSelectionError(null)} label="Back to results" />
                  </div>
                ) : results.length === 0 && !searchQuery.isFetching ? (
                  <p className="px-4 py-4 text-sm text-gray-500" role="status">No matching students found.</p>
                ) : (
                  <ul className="max-h-80 overflow-y-auto py-1">
                    {results.map((record) => (
                      <li key={record.id} role="option" aria-selected="false">
                        <button type="button" disabled={isSelecting} onClick={() => void handleSelectStudent(record)} className="flex min-h-12 w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-inset disabled:cursor-wait disabled:opacity-60">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">{record.studentName.charAt(0).toUpperCase()}</span>
                          <span className="min-w-0"><span className="block truncate font-medium text-gray-900">{record.studentName}</span><span className="block truncate text-xs text-gray-500">{record.matricNumber} · {record.department}</span></span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </div>
          <Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="h-5 w-5 text-gray-600" aria-hidden="true" /></Button>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
            <UserCircle2 className="h-8 w-8 text-gray-400" aria-hidden="true" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user ? `${user.firstName} ${user.lastName}` : "Loading…"}</p>
              <p className="text-xs text-gray-500">{user ? formatRole(user.role) : "Result Management"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
