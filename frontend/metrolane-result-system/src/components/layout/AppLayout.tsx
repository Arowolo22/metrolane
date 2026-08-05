import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"

import { OfflineBanner } from "@/components/states"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopNavigation } from "@/components/layout/TopNavigation"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"
import { queryClient } from "@/lib/queryClient"

const pageTitles: Record<string, string> = {
  "/calculator": "Student Result Entry",
  "/student-records": "Student Records",
  "/settings": "Settings",
  "/support": "State Library",
  "/logout": "Logout",
}

function getPageTitle(pathname: string): string {
  return pageTitles[pathname] ?? "METROLANE Result System"
}

export function AppLayout() {
  const { pathname } = useLocation()
  const isOnline = useOnlineStatus()

  useEffect(() => {
    if (isOnline) {
      void queryClient.refetchQueries({ type: "active" })
    }
  }, [isOnline])

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <TopNavigation title={getPageTitle(pathname)} />
        <OfflineBanner onRetry={() => void queryClient.refetchQueries({ type: "active" })} />
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
