import mongoose,{Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
    {
        name : {
            type : String,
            required : true,
        },
        username : {
            type : String,
            required : true,
            index : true,
            unique : true
        },
        email : {
            type : String,
             required : true,
            index : true,
            unique : true
        },
        password : {
            type : String,
            required : true,
            minlength : 8
        },
        profile : {
            type : String , // cloudinary
            
        }
       

} , 
{timestamps : true})

userSchema.pre("save", async function () {

    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            name : this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
 }

 userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
 }

export  const User = mongoose.model('User', userSchema)