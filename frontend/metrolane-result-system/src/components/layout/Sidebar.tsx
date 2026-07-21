import type { ComponentType } from "react"
import { NavLink } from "react-router-dom"
import {
  Calculator,
  GraduationCap,
  HelpCircle,
  LogOut,
  Settings,
  Users,
} from "lucide-react"
import { motion } from "framer-motion"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const mainNavItems = [
  { to: "/", label: "Calculator", icon: Calculator, end: true },
  { to: "/student-records", label: "Student Records", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
] as const

const bottomNavItems = [
  { to: "/support", label: "Support", icon: HelpCircle },
  { to: "/logout", label: "Logout", icon: LogOut },
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

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
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

      <nav className="flex flex-1 flex-col justify-between px-3 py-6">
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
          </div>
        </div>
      </nav>
    </aside>
  )
}
