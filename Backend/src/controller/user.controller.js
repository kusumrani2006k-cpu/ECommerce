import UserModles from '../models/user.models.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const register = asyncHandler(async (req, res) => {
    const {name, email, username, password} = req.body;

    // check all details vaildtes
    // check exited user 
    
    if(!name && !email && !username && !password){
        return new ApiError(400, "please fill all field")
    }

    const existedUser = await UserModles.findOne({
        $or : [{email}, {username}]
    })

    if (existedUser) {
        return new ApiError(401, "User is already exits")
    }

    const user = await UserModles.create({
        name : name,
        email : email,
        username : username,
        password
    })
    
    // const createdUser = await User.findById(user._id).select("-password -refreshToken")

    //     if (!createdUser) {
    //         throw new ApiError(500, "Something went wrong registering user")
    //     }

    if (!user) {
        return new ApiError(500, "User register is failed")
    }

    return res.status(201).json(
        new ApiResponse(201, user, "User register is successfully")
    )

})