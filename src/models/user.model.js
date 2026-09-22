import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import env from "../config/env.js"

const userSchema = await Schema({
    username : {
        type : String,
        required : true,
        unique : [true , "Username already exists"]
    },
    email : {
        type : String,
        required : true,
        unique : [true , "Email alreay exists"]
    },
    password : {
        type : String,
        required : true
    }
} , {TimeRanges : true})

userSchema.pre("save" , async function (next) {
    const user = this
    if(!user.isModified("password")) return next()
    
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt(user.password , salt)
    next()
})


userSchema.methods.matchPassword = async function (password) {
    const user = this
    return await bcrypt.compare(password , user.password)
}

userSchema.methods.generateAccessToken = async function () {
    const user = this
    return jwt.sign({
        _id : user._id,
        username : user.username,
        password : user.password
    } , env.ACCESS_TOKEN_SECRET , {
        expiresIn : env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = async function (password) {
    const user = this
    return jwt.sign({
        _id : user._id,
        username : user.username,
        password : user.password,
    } , env.REFRESH_TOKEN_SECRET , {
        expiresIn: env.REFRESH_TOKEN_EXPIRY
    })
}

const User =  mongoose.model("User" , userSchema)

export {User}