import {ApiError} from "../helpers/ApiError.js"
import { User } from "../models/user.model";

const generateAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if(!user){
            throw new ApiError(404 , "User not found")
        }
        const accessToken = await user.generateAccessToken()
        if(!accessToken){
            throw new ApiError(401 , "Auth failed")
        }

        return accessToken
    } catch (error) {
        throw new ApiError(500  , "Something went wrong while generating access token" , error.message)
    }
}

const generateRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if(!user){
            throw new ApiError(404 , "User not found")
        }
        const refreshToken = await user.generateRefreshToken
        if(!refreshToken){
            throw new ApiError(401 , "Auth failed")
        }
        return refreshToken
    } catch (error) {
        throw new ApiError(500 , "Something went wrong while generating access" , error.message)
    }
}

export {generateAccessToken , generateRefreshToken}
