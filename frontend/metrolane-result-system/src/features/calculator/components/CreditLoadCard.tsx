import { motion } from "framer-motion"

import { Card, CardContent } from "@/components/ui/card"
import { PLACEHOLDER_VALUE } from "@/lib/utils"

export function CreditLoadCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      <Card className="bg-gray-50/50">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-gray-500">Total Credit Load</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {PLACEHOLDER_VALUE}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
