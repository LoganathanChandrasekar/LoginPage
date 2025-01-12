import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDb from './config/mongodb.js'
import authRouter from './routes/authRouters.js'
import userRouter from './routes/userRouters.js'
const app = express();
const port=process.env.PORT || 4000;
connectDb()
const allowedOrigins=['http://localhost:5173']
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.listen(port,()=>{
    console.log(`Server Running on ........http://127.0.0.1:${port}`);
})
