import { Bell, Menu, Search, UserCircle2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/context/useAuth"

interface TopNavigationProps {
  title: string
  onMenuClick?: () => void
}

function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export function TopNavigation({ title, onMenuClick }: TopNavigationProps) {
  const { user } = useAuth()

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
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              className="h-10 w-56 rounded-lg border border-gray-300 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 lg:w-72"
            />
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
