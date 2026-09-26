import * as pdfParse from 'pdf-parse';
import { generateInterviewReport } from "../services/ai.service.js";
import { InterviewReport } from "../models/interviewReport.model.js";
import { ApiResponse } from "../helpers/ApiResponse.js";
import { ApiError } from "../helpers/ApiError.js";
import { asyncHandler } from "../helpers/asyncHandler.js";
import mongoose from "mongoose";

const generateInterviewReportController = asyncHandler(async (req , res) => {

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
}) 

const getInterviewReportById = asyncHandler(async (req , res) => {
    const {interviewId} = req.params

    if(!mongoose.isValidObjectId(interviewId)){
        throw new ApiError(404 , "Invalid interview ID")
    }

    const interviewReportFound = await InterviewReport.findOne({_id : interviewId , user : req.user._id})

    if(!interviewReportFound){
        throw new ApiError(404 , "Interview Report not found")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200 , InterviewReportFound , "Intervew Report fetched successfully")
        )
})

const getAllInterviewReports = asyncHandler(async (req , res) => {
    const interviewReports = await InterviewReport.find({user : req.user._id}).sort({createdAt : -1}).select("-resume -seflfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    if(!interviewReports){
        throw new ApiError(400 , "Failed to fetch interview reports")
    }

    res
        .status(200)
        .json(new ApiResponse(200 , interviewReports , "Interview Reports fetched successfully"))
})

export {
    generateInterviewReportController,
    getInterviewReportById,
    getAllInterviewReports
}