import mongoose,{Schema} from 'mongoose'
import bcrypt from 'bcrypt'

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

export  const User = mongoose.model('User', userSchema)