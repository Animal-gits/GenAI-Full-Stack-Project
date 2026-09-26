import {Router} from "express"
import { protect } from "../middlewares/auth.middleware.js";
import {generateInterviewReportController, getInterviewReportById , getAllInterviewReports, generateResumePdfController} from "../controllers/interview.controller.js"
import {upload} from "../middlewares/file.middleware.js"

const router = Router()

router.get('/test' , protect  , (req , res) => {
    res.status(200).json({
        message : "This is a test"
    })
})
router.post("/" , protect , upload.single("resume") , generateInterviewReportController)
router.get("/report/:interviewId" , protect , getInterviewReportById )
router.get("/" , protect , getAllInterviewReports)
router.get("/resume/pdf/:interviewId" , protect , generateResumePdfController)

export default router