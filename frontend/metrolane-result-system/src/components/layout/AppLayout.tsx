import { Outlet, useLocation } from "react-router-dom";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { useState } from "react";

const pageTitles: Record<string, string> = {
  "/calculator": "Student Result Entry",
  "/student-records": "Student Records",
  "/settings": "Settings",
  "/support": "State Library",
  "/logout": "Logout",
};

function getPageTitle(pathname: string): string {
  return pageTitles[pathname] ?? "METROLANE Result System";
}

export function AppLayout() {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleMenuClick() {
    setIsSidebarOpen((s) => !s);
  }

  function handleCloseSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <TopNavigation
          title={getPageTitle(pathname)}
          onMenuClick={handleMenuClick}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
