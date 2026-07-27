import type { ReactNode } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { GraduationCap, ShieldCheck } from "lucide-react"

import { AuthFooter } from "@/features/auth/components/AuthFooter"

const panelVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export function AuthLayout({ children }: { children?: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 lg:flex lg:w-[44%] xl:w-[42%]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
        <div className="relative flex flex-col justify-between p-10 xl:p-14">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <GraduationCap className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide">
                  METROLANE
                </p>
                <p className="text-xs text-orange-100">
                  College of Health Sciences and Technology
                </p>
              </div>
            </div>
            <div className="max-w-md space-y-4">
              <h2 className="text-3xl font-semibold leading-tight text-white xl:text-4xl">
                Lecturer Result Management System
              </h2>
              <p className="text-sm leading-relaxed text-orange-50/90">
                Secure workspace for lecturers and authorized academic staff to
                enter, compute, and manage student academic results with
                confidence.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/20 bg-white/10 p-4 text-sm text-orange-50 backdrop-blur-sm">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <p>
              Enterprise-ready authentication UI prepared for backend
              integration, including session policies and optional two-factor
              authentication.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-lg"
            >
              {children ?? <Outlet />}
            </motion.div>
          </AnimatePresence>
        </main>
        <div className="px-4 pb-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-lg">
            <AuthFooter />
          </div>
        </div>
      </div>
    </div>
  )
}
