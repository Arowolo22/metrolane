import { Calculator } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative mb-6"
      >
        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-orange-50">
          <Calculator className="h-20 w-20 text-orange-500/40" />
        </div>
        <div className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
          <span className="text-2xl">📝</span>
        </div>
      </motion.div>
      
      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        No student results have been generated yet
      </h3>
      <p className="mb-8 max-w-sm text-gray-500">
        Start by entering student performance data in the calculator to generate official academic records.
      </p>
      
      <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 shadow-md">
        <Link to="/">
          <Calculator className="mr-2 h-5 w-5" />
          Go to Calculator
        </Link>
      </Button>
    </div>
  )
}
