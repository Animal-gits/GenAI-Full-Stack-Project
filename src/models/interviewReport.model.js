import mongoose from "mongoose"

const technicalQuestionsSchema = new mongoose.Schema({
    question : {
        type : String ,
        required : [true ,"Question is required"]
    },
    intention :{
        type : String,
        required : [true , "Intention is required"]
    },
    answer : {
        type : String ,
        required : [true ,"Answer is required "]
    }
} ,{
    _id : 0
})
const behavioralQuestionsSchema = new mongoose.Schema({
    question : {
        type : String ,
        required : [true ,"Question is required"]
    },
    intention :{
        type : String,
        required : [true , "Intention is required"]
    },
    answer : {
        type : String ,
        required : [true ,"Answer is required "]
    }
} ,{
    _id : 0
})

const interviewReportSchema = new mongoose.Schema({
    jobDesription : {
        type: String,
        required : [true , "Job description is required"]
    },
    resume : {
        type : String
    },
    self_description : {
        type : String
    },
    matchScore : {
        type : Number ,
        min : 0,
        max : 100
    },
    technicalQuestions : [technicalQuestionsSchema],
    behavioralQuestions : [behavioralQuestionsSchema],
    skillGaps,
    preparationPlan,
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    title : {
        type : String,
        required : [ true , "Job Title is required"]
    }
} , {timestamps : true})

const InterviewReport = await mongoose.model("InterviewReport", interviewReportSchema)

export {InterviewReport}