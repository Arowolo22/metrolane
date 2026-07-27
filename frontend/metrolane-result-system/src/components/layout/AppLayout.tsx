import { Outlet, useLocation } from "react-router-dom"

import { Sidebar } from "@/components/layout/Sidebar"
import { TopNavigation } from "@/components/layout/TopNavigation"

const pageTitles: Record<string, string> = {
  "/calculator": "Student Result Entry",
  "/student-records": "Student Records",
  "/settings": "Settings",
  "/support": "Support",
  "/logout": "Logout",
}

function getPageTitle(pathname: string): string {
  return pageTitles[pathname] ?? "METROLANE Result System"
}

export function AppLayout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <TopNavigation title={getPageTitle(pathname)} />
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
