import { Router } from "express"

import {
  createResultHandler,
  getResultHandler,
  updateResultStatusHandler,
} from "../controllers/result.controller.js"
import { authenticate } from "../middleware/auth.js"

const router = Router()

router.use(authenticate)

router.post("/", createResultHandler)
router.get("/:id", getResultHandler)
router.patch("/:id/status", updateResultStatusHandler)

export default router
