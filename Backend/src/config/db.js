import mongoose from "mongoose"
import env from "./env.js"

const connectDB = async () => {
    
    try {
        console.log("MONGO_URI :" , env.MONGO_URI)
        const conn = await mongoose.connect(env.MONGO_URI , {
            dbName : "interview"
        })
    
        console.log("MONGO DB Connection Host !! :" , conn.connection.host)
    } catch (error) {
        console.log("Mongo DB connection failed: " , error.message)
        process.exit(1)
    }
}

export default connectDB