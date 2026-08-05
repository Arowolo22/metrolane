import { FileText, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

interface GenerateResultButtonProps {
  disabled?: boolean
  isLoading?: boolean
  onGenerate: () => void
  label?: string
  loadingLabel?: string
}

export function GenerateResultButton({
  disabled = false,
  isLoading = false,
  onGenerate,
  label = "Generate Result",
  loadingLabel = "Generating...",
}: GenerateResultButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="flex justify-end"
    >
      <Button
        size="lg"
        disabled={disabled || isLoading}
        onClick={onGenerate}
        className="min-w-[200px] shadow-md"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <FileText className="h-5 w-5" />
        )}
        {isLoading ? loadingLabel : label}
      </Button>
    </motion.div>
  )
}
