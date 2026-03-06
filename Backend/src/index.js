import app from "./app.js"
import dotenv from 'dotenv'
import connectDB from './db/index.js'

dotenv.config({
  path : './.env'
})

await connectDB()

.then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running at ${process.env.PORT}`);
    
  })
})
.catch((err) => {
  console.log("Failed to connected ", err)
  
})