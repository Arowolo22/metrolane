import { Router } from "express"

import { listStudentRecordsHandler } from "../controllers/result.controller.js"
import { authenticate } from "../middleware/auth.js"

const router = Router()

router.use(authenticate)
router.get("/", listStudentRecordsHandler)

export default router
