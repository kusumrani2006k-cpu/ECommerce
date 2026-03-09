import mongoose from "mongoose"
import { DBName } from "../constants.js"

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/${DBName}`
    )

    console.log(`MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log("MongoDB connection failed", error)
  }
}

export default connectDb