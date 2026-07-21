import { FileText } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

interface GenerateResultButtonProps {
  disabled: boolean
}

export function GenerateResultButton({ disabled }: GenerateResultButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="flex justify-end"
    >
      <Button
        size="lg"
        disabled={disabled}
        className="min-w-[200px] shadow-md"
      >
        <FileText className="h-5 w-5" />
        Generate Result
      </Button>
    </motion.div>
  )
}
