import {User} from '../models/user.models.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating accessToken and refreshToken")
    }
}

const register = asyncHandler(async (req, res) => {

    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
        throw new ApiError(400, "Please fill all fields")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    // upload images
    const ProfileImageFiles =  req.files?.profile?.[0];

    const profileImage = await uploadOnCloudinary(ProfileImageFiles)
   // console.log(profileImage);
    
    

    const user = await User.create({
        name,
        email,
        username,
        password,
        profile: profileImage?.url || ""
    })

    return res.status(201).json(
        new ApiResponse(201, user, "User registered successfully")
    )

})

// login, logout, getCurrent
const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    if ( !email || !password) {
        throw new ApiError(400, "Please fill all fields")
    }

    // 
     const user = await User.findOne({
        $or: [{ email }]
    })

    if (!user) {
        throw new ApiError(409, "User not created")
    }

    const passwordCorrect = await user.isPasswordCorrect(password);

    if (!passwordCorrect) {
        throw new ApiError(400, "Password is not correct")
    }

       const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const OPTIONS ={
        httpOnly : true,
        secure : true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, OPTIONS)
    .cookie("refreshToken", refreshToken, OPTIONS)
    .json(
        new ApiResponse(
            200, 
            {
                user : loggedInUser, accessToken, refreshToken
            },
            "User logged In successfully"
        )
    )
})


const logout = asyncHandler (async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )

     const options = {
        httpOnly : true,
        secure : true
     }

     return res
     .status(201)
     .clearCookie("accessToken", options)
     .clearCookie("refreshToken", options)
     .json(
        new ApiResponse(201 ,{} , "User logged out")
     )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(201)
    .json (
        new ApiResponse(201, req.user, "User fetched successfully")
    )
})


// change password, updateProfile
export {
    register,
    login,
    logout,
    getCurrentUser,

}