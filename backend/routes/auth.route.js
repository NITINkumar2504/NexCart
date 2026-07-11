import express from 'express'
import { getProfile, loginUser, logoutUser, refreshAccessToken, signupUser } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post("/signup", signupUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/refresh-token", refreshAccessToken)
router.get("/profile", protectRoute, getProfile)

export default router