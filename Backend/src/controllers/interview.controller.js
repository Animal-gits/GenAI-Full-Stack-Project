import * as pdfParse from 'pdf-parse';
import { generateInterviewReport, generateResumePdf } from "../services/ai.service.js";
import { InterviewReport } from "../models/interviewReport.model.js";
import { ApiResponse } from "../helpers/ApiResponse.js";
import { ApiError } from "../helpers/ApiError.js";
import { asyncHandler } from "../helpers/asyncHandler.js";
import mongoose from "mongoose";

const generateInterviewReportController = asyncHandler(async (req, res) => {

    if (!req.file) {
        throw new ApiError(400, "Please upload a resume PDF")
    }

    const resumeFileContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

    if (!resumeFileContent) {
        throw new ApiError(404, "Could not find Resume or Resume content")
    }

    const { selfDescription, jobDescription } = req.body

    if (!jobDescription || jobDescription.trim() === "") {
        throw new ApiError(400, "Please enter the Job Description")
    }

    const InterviewReportByAI = await generateInterviewReport({
        resume: resumeFileContent.text,
        selfDescription,
        jobDescription
    })

    if (!InterviewReportByAI) {
        throw new ApiError(400, "The response from AI did not work")
    }

    if (!InterviewReportByAI?.title) {
    throw new ApiError(422, "AI response was missing required fields, please retry")
}

    const InterviewReportRes = await InterviewReport.create({
        user: req.user._id,
        resume: resumeFileContent.text,
        selfDescription,
        jobDescription,
        ...InterviewReportByAI
    })

    if (!InterviewReportRes) {
        throw new ApiError(400, "Interview Report Generation Process failed!")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, InterviewReportRes, "Interview Report generated sucessfully")
        )
})

const getInterviewReportById = asyncHandler(async (req, res) => {
    const { interviewId } = req.params

    if (!mongoose.isValidObjectId(interviewId)) {
        throw new ApiError(404, "Invalid interview ID")
    }

    const interviewReportFound = await InterviewReport.findOne({ _id: interviewId, user: req.user._id })

    if (!interviewReportFound) {
        throw new ApiError(404, "Interview Report not found")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, interviewReportFound, "Intervew Report fetched successfully")
        )
})

const getAllInterviewReports = asyncHandler(async (req, res) => {
    const interviewReports = await InterviewReport.find({ user: req.user._id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    if (!interviewReports) {
        throw new ApiError(400, "Failed to fetch interview reports")
    }

    res
        .status(200)
        .json(new ApiResponse(200, interviewReports, "Interview Reports fetched successfully"))
})

const generateResumePdfController = asyncHandler(async (req, res) => {
    const { interviewId } = req.params

    if (!mongoose.isValidObjectId(interviewId)) {
        throw new ApiError(400, "Invalid Interview Id")
    }

    const interviewReportFound = await InterviewReport.findOne({
        _id: interviewId,
        user: req.user._id
    })

    if (!interviewReportFound) {
        throw new ApiError(404, "Interview Report not found")
    }

    const { resume, selfDescription, jobDescription } = interviewReportFound

    const pdfBuffer = await generateResumePdf({ resume, selfDescription, jobDescription })

    if (!pdfBuffer) {
        throw new ApiError(400, "Failed to make PDF")
    }

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewId}.pdf`
    })

    res.send(pdfBuffer)
})

export {
    generateInterviewReportController,
    getInterviewReportById,
    getAllInterviewReports,
    generateResumePdfController
}