import mongoose,{Schema} from 'mongoose'

const productSchema = new Schema(
    {
        vendorid:{
        type : Schema.Types.ObjectId,
            ref : "User"
        },

    name: {
       type: String,
       required : true,

    },
    price:{
       type:Number,
        required : true,
    },
    stock:{
        type:Number,
         required : true,
    },
    description:{
        type: String,
        required:true,
    },
    image:{
      type:String,
      required: true,
    }


    
    } , 
    {timestamps : true})
    
    export const Product = mongoose.model('Product', productSchema)