import { FormProvider, type UseFormReturn } from "react-hook-form"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentInformationForm } from "@/features/calculator/components/StudentInformationForm"
import { StudentPhotoPlaceholder } from "@/features/calculator/components/StudentPhotoPlaceholder"
import type { StudentInformationFormValues } from "@/features/calculator/utils/validation"

interface StudentInformationCardProps {
  form: UseFormReturn<StudentInformationFormValues>
}

export function StudentInformationCard({ form }: StudentInformationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full bg-gray-50/50">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <div className="flex flex-col gap-6 lg:flex-row">
              <StudentPhotoPlaceholder />
              <StudentInformationForm />
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </motion.div>
  )
}
