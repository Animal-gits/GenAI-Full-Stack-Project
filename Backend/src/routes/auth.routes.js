import express from "express"
import {protect} from "../middlewares/auth.middleware.js"
import {registerUser , loginUser , logoutUser , refreshAccessToken} from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/register" , registerUser)
router.post("/login" , loginUser)
router.post("/logout" , protect , logoutUser)
router.post("/refreshToken" , protect , refreshAccessToken)
export default router