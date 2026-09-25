import pdfParse from "pdf-parse"
import { generateInterviewReport } from "../services/ai.service.js";
import { InterviewReport } from "../models/interviewReport.model";
import { ApiResponse } from "../helpers/ApiResponse";
import { ApiError } from "../helpers/ApiError";

const generateInterviewReportController = async (req , res) => {

    const resumeFileContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

    if(!resumeFileContent){
        throw new ApiError(404 , "Could not find Resume or Resume content")
    }

    const {selfDescription , jobDescription} = req.body

    if(!jobDescription || jobDescription.trim() === ""){
        throw new ApiError(400 , "Please enter the Job Description")
    }

    const InterviewReportByAI = await generateInterviewReport({
        resume : resumeFileContent.text,
        selfDescription,
        jobDescription
    })

    if(!InterviewReportByAI){
        throw new ApiError(400 , "The response from AI did not work")
    }

    const InterviewReportRes = await InterviewReport.create({
        user : req.user._id,
        resume : resumeFileContent.text,
        selfDescription,
        jobDescription,
        ...InterviewReportByAI
    })

    if(!InterviewReportRes){
        throw new ApiError(400 ,"Interview Report Generation Process failed!")
    }

    return res
        .status(202)
        .json(
            new ApiResponse(201 , InterviewReportRes , "Interview Report generated sucessfully")
        )
}

export {
    generateInterviewReportController
}