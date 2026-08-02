import type { ComponentType } from "react"
import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  Calculator,
  GraduationCap,
  HelpCircle,
  Loader2,
  LogOut,
  Settings,
  Users,
} from "lucide-react"
import { motion } from "framer-motion"

import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/features/auth/context/useAuth"
import { cn } from "@/lib/utils"

const mainNavItems = [
  { to: "/calculator", label: "Calculator", icon: Calculator, end: true },
  { to: "/student-records", label: "Student Records", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
] as const

const bottomNavItems = [
  { to: "/support", label: "Support", icon: HelpCircle },
] as const

function NavItem({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
  end?: boolean
}) {
  return (
    <NavLink to={to} end={end} className="block">
      {({ isActive }) => (
        <motion.div
          whileHover={{ x: 2 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive
              ? "bg-orange-500 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <span>{label}</span>
        </motion.div>
      )}
    </NavLink>
  )
}

function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
      navigate("/login", { replace: true })
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-60"
    >
      {isLoggingOut ? (
        <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
      ) : (
        <LogOut className="h-5 w-5 shrink-0" />
      )}
      <span>Logout</span>
    </button>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
      <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-orange-500">
            METROLANE
          </p>
          <p className="truncate text-xs leading-tight text-gray-500">
            College of Health Sciences &amp; Technology
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col justify-between overflow-y-auto px-3 py-6">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>

        <div className="space-y-3">
          <Separator />
          <div className="space-y-1">
            {bottomNavItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
            <LogoutButton />
          </div>
        </div>
      </nav>
    </aside>
  )
}
