import mongoose,{Schema} from 'mongoose'

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
            min : 8
        },
        profile : {
            type : String , // cloudinary
            
        }
       

} , 
{timestamps : true})

const User = mongoose.models('User', userSchema)