import env from "../config/env.js";
import { ApiError } from "../helpers/ApiError.js";
import { asyncHandler } from "../helpers/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


const protect = asyncHandler(async (req , res , next) => {
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization").replace("Bearer " , "")

    if(!token){
        throw new ApiError(404 , "Not Authorized . Token not found!")
    }

    const decoded = jwt.verify(token , env.ACCESS_TOKEN_SECRET)
    if(!decoded){
        throw new ApiError(404 , "Not Authorized . Token not found!")
    }

    const user = await User.findById(decoded._id).select("-password -refreshToken")

    if(!user){
        throw new ApiError(404 , "Not Authorized . Token Failed !")
    }

    req.user = user
    if(!mongoose.isValidObjectId(req.user._id)){
            throw new ApiError(400 , "Invalid User ID")
    }
    
    next()
    } catch (error) {
        throw new ApiError(404 , "Not Authorized . Token not found !!" || error.message)
    }
})

export {protect}