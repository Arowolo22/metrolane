import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StudentInformationForm } from "@/features/calculator/components/StudentInformationForm"
import { StudentPhotoUpload } from "@/features/calculator/components/StudentPhotoUpload"

export function StudentInformationCard() {
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
          <div className="flex flex-col gap-6 lg:flex-row">
            <StudentPhotoUpload />
            <StudentInformationForm />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
