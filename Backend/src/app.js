import express from 'express'
import cors from 'cors'


const app = express()

app.use(cors({
    origin : process.env.CORS,
    credentials : true
}))

app.use(express.json());
app.use(express.static("public"));



app.get('/', (req, res) => {
  res.send('Hello World')
})

export default app