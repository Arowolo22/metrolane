import { Router } from "express"

import { uploadStudentPhotoHandler } from "../controllers/upload.controller.js"
import { authenticate } from "../middleware/auth.js"

const router = Router()

router.use(authenticate)
router.post("/student-photo", uploadStudentPhotoHandler)

export default router
