import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'


import userRoute from './routes/userRoute'
import adminRoute from './routes/adminRoute'
import doctorRoute from './routes/doctorRoute'

dotenv.config()
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use(
    cors({
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    })
);


app.use('/',userRoute)
app.use('/admin',adminRoute)
app.use('/doctor',doctorRoute)
app.use((err:Error, _req:express.Request, res:express.Response):void => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

export default app