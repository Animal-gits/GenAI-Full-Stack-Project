import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static('public'))
app.use(cookieParser())



//middleware declaration


//routes imports



// routes declaraton

//error middleware

export default app
