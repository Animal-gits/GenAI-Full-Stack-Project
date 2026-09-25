import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import env from "./config/env.js"
import cors from "cors"

const app = express()

app.use(cors({
    origin : env.CORS_ORIGIN,
    credentials: true
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static('public'))
app.use(cookieParser())



//middleware declaration


//routes imports
import AuthRouter from "../src/routes/auth.routes.js"
import InterviewRouter from "./routes/interview.routes.js"


// routes declaraton
app.use('/api/v1/auth' , AuthRouter)
app.use('api/v1/interview' , InterviewRouter)
//error middleware

export default app
