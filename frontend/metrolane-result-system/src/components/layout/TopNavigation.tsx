import { Bell, Loader2, Menu, Search, UserCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/context/useAuth"
import {
  fetchResultById,
  fetchStudentRecords,
} from "@/features/student-records/services/studentRecordsService"
import type { StudentRecord } from "@/features/student-records/types"

interface TopNavigationProps {
  title: string
  onMenuClick?: () => void
}

function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

const SEARCH_DEBOUNCE_MS = 300
const MAX_RESULTS = 6

export function TopNavigation({ title, onMenuClick }: TopNavigationProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<StudentRecord[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const term = query.trim()
    if (term.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([])
      setIsSearching(false)
      return
    }

    let cancelled = false
    setIsSearching(true)

    const timer = window.setTimeout(() => {
      fetchStudentRecords({ search: term })
        .then((records) => {
          if (cancelled) return
          setResults(records.slice(0, MAX_RESULTS))
          setIsOpen(true)
        })
        .catch(() => {
          if (!cancelled) setResults([])
        })
        .finally(() => {
          if (!cancelled) setIsSearching(false)
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query])

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
    try {
      const detail = await fetchResultById(record.id)
      setIsOpen(false)
      setQuery("")
      setResults([])
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
    } catch {
      // Swallow lookup failures silently; the dropdown stays open so the user can retry.
    } finally {
      setIsSelecting(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              {title}
            </h1>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div ref={containerRef} className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => {
                if (results.length > 0) setIsOpen(true)
              }}
              placeholder="Search student by name or matric number..."
              className="h-10 w-56 rounded-lg border border-gray-300 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 lg:w-72"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
            )}

            {isOpen && query.trim().length >= 2 && (
              <div className="absolute right-0 top-12 z-40 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                {results.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-500">
                    {isSearching ? "Searching…" : "No matching students found."}
                  </p>
                ) : (
                  <ul className="max-h-80 overflow-y-auto py-1">
                    {results.map((record) => (
                      <li key={record.id}>
                        <button
                          type="button"
                          disabled={isSelecting}
                          onClick={() => handleSelectStudent(record)}
                          className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm hover:bg-orange-50 disabled:cursor-wait disabled:opacity-60"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
                            {record.studentName.charAt(0).toUpperCase()}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-medium text-gray-900">
                              {record.studentName}
                            </span>
                            <span className="block truncate text-xs text-gray-500">
                              {record.matricNumber} · {record.department}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
            <UserCircle2 className="h-8 w-8 text-gray-400" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-800">
                {user ? `${user.firstName} ${user.lastName}` : "Loading…"}
              </p>
              <p className="text-xs text-gray-500">
                {user ? formatRole(user.role) : "Result Management"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
