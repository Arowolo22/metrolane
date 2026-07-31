import { Router } from "express"
import rateLimit from "express-rate-limit"

import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resetPasswordHandler,
} from "../controllers/auth.controller.js"
import { authenticate } from "../middleware/auth.js"

const router = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
})

router.post("/register", authLimiter, register)
router.post("/login", authLimiter, login)
router.post("/forgot-password", authLimiter, forgotPassword)
router.post("/reset-password", authLimiter, resetPasswordHandler)
router.post("/refresh", authLimiter, refresh)
router.post("/logout", logout)
router.get("/me", authenticate, me)

export default router
