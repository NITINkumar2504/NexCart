import express from 'express'
import { loginUser, logoutUser, refreshAccessToken, signupUser } from '../controllers/auth.controller.js'

const router = express.Router()

router.post("/signup", signupUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/refresh-token", refreshAccessToken)
// router.get("/profile", protectedRoute, getProfile)

export default router