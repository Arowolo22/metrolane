import { Loader2, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { ActionButtons } from "@/features/student-records/components/ActionButtons"
import { EmptyState } from "@/features/student-records/components/EmptyState"
import { StatusBadge } from "@/features/student-records/components/StatusBadge"
import { fetchStudentRecords } from "@/features/student-records/services/studentRecordsService"
import type { ResultStatus, StudentRecord } from "@/features/student-records/types"
import { getApiErrorMessage } from "@/lib/api"

const statusOptions: Array<{ label: string; value: ResultStatus | "all" }> = [
  { label: "All Statuses", value: "all" },
  { label: "Generated", value: "Generated" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
]

export function StudentRecordsPage() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<StudentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<ResultStatus | "all">("all")

  useEffect(() => {
    let cancelled = false
    // Reset loading/error for the new filter combination before the fetch resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    setError(null)

    fetchStudentRecords({
      search: search.trim() || undefined,
      status: status === "all" ? undefined : status,
    })
      .then((data) => {
        if (!cancelled) setRecords(data)
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, "Failed to load student records."))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [search, status])

  const hasFilters = search.trim().length > 0 || status !== "all"

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Student Records</CardTitle>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or matric number"
              className="w-full pl-9 sm:w-64"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as ResultStatus | "all")}
          >
            <SelectTrigger className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          </div>
        ) : records.length === 0 ? (
          hasFilters ? (
            <p className="py-16 text-center text-sm text-gray-500">
              No student records match your filters.
            </p>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Programme</TableHead>
                  <TableHead>Level / Semester</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>CGPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <p className="font-medium text-gray-900">{record.studentName}</p>
                      <p className="text-xs text-gray-500">{record.matricNumber}</p>
                    </TableCell>
                    <TableCell>
                      <p>{record.programme}</p>
                      <p className="text-xs text-gray-500">{record.department}</p>
                    </TableCell>
                    <TableCell>
                      Level {record.level} · {record.semester}
                    </TableCell>
                    <TableCell>{record.gpa.toFixed(2)}</TableCell>
                    <TableCell>{record.cgpa !== null ? record.cgpa.toFixed(2) : "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <ActionButtons
                          onView={() => navigate(`/student-records/${record.id}`)}
                          onEdit={() => navigate(`/student-records/${record.id}?edit=1`)}
                          onPrint={() => {
                            navigate(`/student-records/${record.id}?print=1`)
                            toast.info("Opening result for printing…")
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
