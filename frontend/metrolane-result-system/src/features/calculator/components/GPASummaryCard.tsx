import { useFormContext } from "react-hook-form"
import { motion } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { StudentInformationFormValues } from "@/features/calculator/utils/validation"

export function GPASummaryCard() {
  const { watch, setValue } = useFormContext<StudentInformationFormValues>()

  const currentGpa = watch("currentGpa") ?? ""
  const totalCreditUnits = watch("totalCreditUnits") ?? ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="h-full"
    >
      <div className="flex h-full flex-col justify-center rounded-xl bg-orange-500 p-6 text-white shadow-md">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentGpa" className="text-sm font-medium text-orange-100">
              Current GPA
            </Label>
            <Input
              id="currentGpa"
              type="number"
              step="0.01"
              min="0"
              max="5"
              value={currentGpa}
              onChange={(event) =>
                setValue("currentGpa", event.target.value, { shouldValidate: true })
              }
              className="border-orange-300/50 bg-white text-gray-900"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalCreditUnits" className="text-sm font-medium text-orange-100">
              Total Credit Units
            </Label>
            <Input
              id="totalCreditUnits"
              type="number"
              min="0"
              value={totalCreditUnits}
              onChange={(event) =>
                setValue("totalCreditUnits", event.target.value, { shouldValidate: true })
              }
              className="border-orange-300/50 bg-white text-gray-900"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
