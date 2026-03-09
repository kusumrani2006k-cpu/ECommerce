import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

app.use(cors({
    origin : process.env.CORS,
    credentials : true
}))

app.use(express.json({limit : "25mb"}))
app.use(express.urlencoded({extended : true, limit : "15mb"}))
app.use(express.static("public"))
app.use(cookieParser())

// imported routes
import userRouter from './routes/user.routes.js'


app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use("/api/v1/user", userRouter)



export default app