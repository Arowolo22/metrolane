import { Search } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

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
  EmptyState,
  ErrorState,
  LoadingSpinner,
  SkeletonLoader,
  SlowNetworkNotice,
} from "@/components/states"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ActionButtons } from "@/features/student-records/components/ActionButtons"
import { StatusBadge } from "@/features/student-records/components/StatusBadge"
import { useStudentRecordsQuery } from "@/features/student-records/hooks/useStudentRecordsQuery"
import type { ResultStatus } from "@/features/student-records/types"
import { notifyInfo } from "@/lib/notifications"

const statusOptions: Array<{ label: string; value: ResultStatus | "all" }> = [
  { label: "All Statuses", value: "all" },
  { label: "Generated", value: "Generated" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
]

export function StudentRecordsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<ResultStatus | "all">("all")
  const query = useStudentRecordsQuery({
    search,
    status: status === "all" ? undefined : status,
  })
  const records = query.data ?? []
  const hasFilters = search.trim().length > 0 || status !== "all"

  function clearFilters() {
    setSearch("")
    setStatus("all")
  }

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Student Records</CardTitle>
          {query.isFetching && !query.isLoading ? (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500" role="status">
              <LoadingSpinner label="Refreshing records" />
              Refreshing records…
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or matric number"
              aria-label="Search student records"
              className="w-full pl-9 sm:w-64"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as ResultStatus | "all")}
          >
            <SelectTrigger className="sm:w-40" aria-label="Filter by status">
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
        <SlowNetworkNotice isLoading={query.isLoading} className="mb-4 border-blue-200 bg-blue-50 text-blue-900" />

        {query.isLoading ? (
          <SkeletonLoader variant="table" rows={6} />
        ) : query.isError && records.length === 0 ? (
          <ErrorState
            error={query.error}
            onRetry={() => void query.refetch()}
            attempt={query.failureCount + 1}
            maxAttempts={3}
            onContactSupport={() => notifyInfo("Support contact", `Reference ${query.error.errorId}`)}
          />
        ) : records.length === 0 ? (
          <EmptyState
            icon={hasFilters ? Search : undefined}
            title={hasFilters ? "No student records match your filters" : "No student records yet"}
            description={
              hasFilters
                ? "Try a different search or clear the filters to see every record."
                : "Start by entering student performance data in the calculator to generate an official academic record."
            }
            actionLabel={hasFilters ? "Clear filters" : "Go to calculator"}
            onAction={() => (hasFilters ? clearFilters() : navigate("/calculator"))}
          />
        ) : (
          <>
            {query.isError ? (
              <ErrorState
                error={query.error}
                compact
                onRetry={() => void query.refetch()}
                attempt={query.failureCount + 1}
                maxAttempts={3}
                className="mb-4"
              />
            ) : null}
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
                      <TableCell>Level {record.level} · {record.semester}</TableCell>
                      <TableCell>{record.gpa.toFixed(2)}</TableCell>
                      <TableCell>{record.cgpa !== null ? record.cgpa.toFixed(2) : "—"}</TableCell>
                      <TableCell><StatusBadge status={record.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <ActionButtons
                            onView={() => navigate(`/student-records/${record.id}`)}
                            onEdit={() => navigate(`/calculator?editId=${record.id}`)}
                            onPrint={() => {
                              navigate(`/student-records/${record.id}?print=1`)
                              notifyInfo("Opening result for printing…")
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
