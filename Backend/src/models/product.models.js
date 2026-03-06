import mongoose,{Schema} from 'mongoose'

const productSchema = new Schema(
    {
        vendorid:{
        type : Schema.Types.ObjectId,
            ref : "User"
        },

    name: {
       type: String,
       require : true,

    },
    price:{
       type:Number,
        require : true,
    },
    stock:{
        type:Number,
         require : true,
    },
    description:{
        type: String,
        required:true,
    },
    image:{
      type:String,
      require: true,
    }


    
    } , 
    {timestamps : true})
    
    export const Product = mongoose.models('Product', productSchema)