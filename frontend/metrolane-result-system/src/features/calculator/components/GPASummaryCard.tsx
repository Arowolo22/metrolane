import { motion } from "framer-motion"

import { PLACEHOLDER_VALUE } from "@/lib/utils"

export function GPASummaryCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="h-full"
    >
      <div className="flex h-full flex-col justify-center rounded-xl bg-orange-500 p-6 text-white shadow-md">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-orange-100">Current GPA</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">
              {PLACEHOLDER_VALUE}
            </p>
          </div>
          <div className="border-t border-orange-400/40 pt-6">
            <p className="text-sm font-medium text-orange-100">
              Total Credit Units
            </p>
            <p className="mt-1 text-4xl font-bold tracking-tight">
              {PLACEHOLDER_VALUE}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
