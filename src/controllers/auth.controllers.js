import { ApiError } from "../helpers/ApiError";
import {User} from "../models/user.model.js"
import {ApiResponse} from "../helpers/ApiResponse.js"
import {generateAccessToken , generateRefreshToken} from "../config/generateToken.js"

const registerUser = async(req , res) => {
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


    const cookieOptions ={
        httpOnly : true,
        secure : true
    }

    if(!registeredUser){
        throw new ApiError(401 , "Error occured in registering your acccount")
    }else{
        res
            .cookie("accessToken" , accessToken , cookieOptions)
            .cookie("refreshToken", refreshToken , cookieOptions)
            .status(201)
            .json(
                new ApiResponse(201 , registeredUser , "Account created successfully" )
            )
    }

}