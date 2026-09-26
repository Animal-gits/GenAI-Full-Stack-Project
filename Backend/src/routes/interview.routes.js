import {Router} from "express"
import { protect } from "../middlewares/auth.middleware.js";
import {generateInterviewReportController, getInterviewReportById , getAllInterviewReports} from "../controllers/interview.controller.js"

const router = Router()

router.post("/" , protect , generateInterviewReportController)
router.get("/report/:interviewId" , protect , getInterviewReportById )
router.get("/" , protect , getAllInterviewReports)

export default router