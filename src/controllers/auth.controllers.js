import { ApiError } from "../helpers/ApiError";
import {User} from "../models/user.model.js"
import {ApiResponse} from "../helpers/ApiResponse.js"
import {asyncHandler} from "../helpers/asyncHandler.js"
import {generateAccessToken , generateRefreshToken} from "../config/generateToken.js"
import jwt from "jsonwebtoken"
import env from "../config/env.js";
import cookieOptions from "../config/cookieOptions.js"

const registerUser = asyncHandler(async(req , res) => {
    const {username , email , password} = req.body

    if(!username || username.trim() === ""){
        throw new ApiError(401 , "Enter the username")
    }
    if(!email || email.trim() === ""){
        throw new ApiError(401 , "Enter the email")
    }
    if(!password || password.trim() === ""){
        throw new ApiError(401 , "Enter the password")
    }

    const isUserExists = await User.findOne({
        $or : [{username} , {email}]
    })

    if(isUserExists){
        throw new ApiError(400 , "USeralready exists")
    }

    const user = await User.create({
        username , 
        email,
        password,
    })

    const accessToken = await generateAccessToken(user._id)
    const refreshToken = await generateRefreshToken(user._id)

    const registeredUser = await User.findByIdAndUpdate(
        user._id,
        {
            $set: {
                refreshToken: refreshToken
            }
        },
        { new : true}
    ).select("-password -refreshToken")


    if(!registeredUser){
        throw new ApiError(401 , "Error occured in registering your acccount")
    }else{
        return res
            .cookie("accessToken" , accessToken , cookieOptions)
            .cookie("refreshToken", refreshToken , cookieOptions)
            .status(201)
            .json(
                new ApiResponse(201 , registeredUser , "Account created successfully" )
            )
    }

})

const loginUser = asyncHandler(async (req, res) => {
    const {email , password} = req.body

    if(!email || email.trim() === ""){
        throw new ApiError(401 , "Enter the email")
    }
    if(!password || password.trim() === ""){
        throw new ApiError(401 , "Enter the password")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404 , "User not found")
    }

    const isPasswordCorrect = await user.matchPassword(password)

    if(!isPasswordCorrect){
        throw new ApiError(404 , "User not found")
    }

    const accessToken = await generateAccessToken(user._id)
    const refreshToken = await generateRefreshToken(user._id)

    const loggedInUser = await User.findByIdAndUpdate(
        user._id , 
        {
            $set : {
                refreshToken : refreshToken
            }
        },
        {new : true}
    ).select("-password -refreshToken")


    if(!loggedInUser){
        throw new ApiError(404 , "Failed to log in User")
    }else{
        return res
            .status(200)
            .cookie("accessToken" , accessToken , cookieOptions)
            .cookie("refreshToken", refreshToken , cookieOptions)
            .json(
                new ApiResponse(200 , loggedInUser , "User logged-in successfuly")
            )
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    const loggedOutUser = await User.findByIdAndUpdate( 
    req.user._id
    , {
        $unset : {
            refreshToken : 1
        }
    } , {new : true}).select("-password -refreshToken")


    if(!loggedOutUser){
        throw new ApiError(401 , "User log out processs failed")
    }else{
        return res
                .clearCookies("accessToken" , cookieOptions)
                .clearCookies("refreshToken" , cookieOptions)
                .status(200)
                json(
                    new ApiResponse(200 , loggedOutUser  , "User logged-out successfully!")
                )
    }
})

const refreshAccessToken = asyncHandler(async (req , res) => {
    const incomingRefreshToken = req.body.refreshToken || req.cookies?.refreshToken
    try {
        const decoded = jwt.verify(
            incomingRefreshToken , env.REFRESH_TOKEN_SECRET
        )
        if(!decoded){
            throw new ApiError(404 , 'Not Authorized . Token not found!')
        }

        const user = await User.findById(decoded._id).select("-password")
        if(!user){
            throw new ApiError(404 , "Not Authorized . Token not found!")
        }

        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(404 , "Not Authorized . Token not found!")
        }

        const accessToken = await generateAccessToken(user._id)
        const newRefreshToken = await generateRefreshToken(user._id)

        const newUser = await User.findByIdAndUpdate(
            user._id,
            {
                $set : {
                    refreshToken : newRefreshToken
                }
            },
            {new : true}
        ).select("-password -refreshToken")

        return res
            .status(200)
            .cookie("accessToken" , accessToken  , cookieOptions )
            .cookie("refreshToken" , newRefreshToken  , cookieOptions )
            .json(
                new ApiResponse(200 , newUser , "Access Token refreshed succcessfully")
            )
    } catch (error) {
        throw new ApiError(404, "Not Authorized" || error.message)
    }
})

export {
    loginUser,
    registerUser,
    logoutUser,
    refreshAccessToken
}