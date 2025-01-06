import express from "express";  
import {login,register,logOut, sendVerifyOtp, verifyEmail} from "../controllers/authController.js"
import userAuth from "../middleware/userAuth.js"
const authRouter = express.Router();
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logOut)
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp)
authRouter.post('/verify-account', userAuth, verifyEmail)

export default authRouter;
