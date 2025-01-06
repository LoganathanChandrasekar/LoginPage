import express from "express";  
import {login,register,logOut, sendVerifyOtp, verifyEmail,isAuthentication,sendResetOtp,resetPassword} from "../controllers/authController.js"
import userAuth from "../middleware/userAuth.js"
const authRouter = express.Router();
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logOut)
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp)
authRouter.post('/verify-account', userAuth, verifyEmail)
authRouter.post('/is-auth', userAuth, isAuthentication)
authRouter.post('/send-reset-otp', sendResetOtp)
authRouter.post('/reset-password', resetPassword)

export default authRouter;
