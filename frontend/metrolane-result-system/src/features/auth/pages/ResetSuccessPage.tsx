import { MailCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { AuthCard } from "@/features/auth/components/AuthCard"

export function ResetSuccessPage() {
  return (
    <AuthCard>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 shadow-inner">
          <MailCheck className="h-10 w-10" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-gray-900">Check your email</h1>
          <p className="text-sm leading-relaxed text-gray-500">
            Password reset instructions have been sent to your email.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link to="/login">Return to Login</Link>
        </Button>
      </motion.div>
    </AuthCard>
  )
}
