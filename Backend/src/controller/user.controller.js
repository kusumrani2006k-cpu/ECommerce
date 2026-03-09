import {User} from '../models/user.models.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'

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

export {
    register,
    
}