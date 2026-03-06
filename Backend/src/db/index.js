import mongoose from "mongoose";
import { DBName } from "../constants.js";
import dotenv from 'dotenv'
dotenv.config()


 const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${DBName}`)
         console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`) 
    } catch (error) {
        console.log("Mongo connect failed ", error)
    }
}

export default  connectDB