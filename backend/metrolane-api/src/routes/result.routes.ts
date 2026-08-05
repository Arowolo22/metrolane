import { Router } from "express"

import {
  createResultHandler,
  getResultHandler,
  updateResultHandler,
  updateResultStatusHandler,
} from "../controllers/result.controller.js"
import { authenticate } from "../middleware/auth.js"

const router = Router()

router.use(authenticate)

router.post("/", createResultHandler)
router.get("/:id", getResultHandler)
router.put("/:id", updateResultHandler)
router.patch("/:id/status", updateResultStatusHandler)

export default router
