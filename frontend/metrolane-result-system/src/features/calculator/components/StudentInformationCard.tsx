import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentInformationForm } from "@/features/calculator/components/StudentInformationForm"
import { StudentPhotoPlaceholder } from "@/features/calculator/components/StudentPhotoPlaceholder"
import { EMPTY_STUDENT_INFORMATION } from "@/features/calculator/types"
import {
  studentInformationSchema,
  type StudentInformationFormValues,
} from "@/features/calculator/utils/validation"

export function StudentInformationCard() {
  const form = useForm<StudentInformationFormValues>({
    resolver: zodResolver(studentInformationSchema),
    defaultValues: EMPTY_STUDENT_INFORMATION,
    mode: "onChange",
  })

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
