import { Router } from "express"

import {
  studentPhotoUpload,
  uploadStudentPhotoHandler,
} from "../controllers/upload.controller.js"
import { authenticate } from "../middleware/auth.js"

const router = Router()

router.use(authenticate)
router.post("/student-photo", studentPhotoUpload, uploadStudentPhotoHandler)

export default router
