import {Router} from "express"
import { protect } from "../middlewares/auth.middleware.js";
import {generateInterviewReportController} from "../controllers/interview.controller.js"

const router = Router()

router.post("/" , protect , generateInterviewReportController)

export default router