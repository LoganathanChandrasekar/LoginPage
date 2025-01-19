import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import transporter from '../config/nodemailer.js'
export const register= async(req,res)=>{

    const{name,email,password}=req.body;

    if(!name||!email||!password){
        return res.json({
            success: false,
            message:"Missing Details"
        })
    }
    try{
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.json({
                success: false,
                message:"user already Exist"
            })
        }
        const hashpassword= await bcrypt.hash(password,10)
        const user= new userModel({
            name,email,password:hashpassword
        },)
        await user.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge: 7*24*60*60*1000
        })
        const mailOptions ={
            from: process.env.SMTP_USER,
            to: email,
            subject:'Welcome to fun chat',
            text:`Hello ${name}, Welcome to fun chat. Your Login Credentials are: \n Email: ${email} `
        }
        await transporter.sendMail(mailOptions)
        return res.json({
            success: true,
            message:"Sign Up Successfully"
        })
    }catch(error){
        res.json({
            success: false,
            message:error.message
        })
    }

}

export const login= async(req,res)=>{
    const{email,password}=req.body;
    if(!email||!password){
        return res.json({
            success: false,
            message:"Email and Password Required"
        })
    }
    try{
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({
                success: false,
                message:"user not found"
            })
        }
        const ismatch=await bcrypt.compare(password,user.password)
        if(!ismatch){
            return res.json({
                success: false,
                message:"incorrrect password"
            })
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge: 7*24*60*60*1000
        })
        const mailoptions={
            from:'your_email@example.com',
            to:user.email,
            subject:'Login Successful',
            text:`You have successfully logged in`
        }


        return res.json({success: true})
    }catch(error){
        res.json({
            success: false,
            message:error.message
        })
    }
}

export const logOut= async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
        })
        return res.json({success: true,message:'Logout'})
    }catch(error){
        res.json({
            success: false,
            message:error.message
        })
    }
}

export const sendVerifyOtp= async(req,res)=>{
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(user.isAccountVerified){
            return res.json({sucess:false,message:"Account Already Verified"})
        }
        const otp = String(Math.floor(100000+Math.random()*900000))
        user.verifyOtp = otp;
        user.verifyOtpExprireAt = Date.now() + 24*60*60*1000;
        await user.save();
        const mailOptions ={
            from: process.env.SMTP_USER,
            to: user.email,
            subject:'Account Verification OTP',
            text:` Your OTP is ${otp}  `
        }
        await transporter.sendMail(mailOptions)
        return res.json({success:true,message:"verification Email sent successfully"});
    }catch(error){
        res.json({sucess:false,message:error.message})  
    }
}

export const verifyEmail=async(req,res)=>{
    const {userId,otp}=req.body;
    if(!userId || !otp){
        return res.json({sucess:false,message:"Missing Details"})
    }
    try{
        const user =await userModel.findById(userId);
        if(!user){
            return res.json({sucess:false,message:"User Not Found"})
        }
        if(user.verifyOtp=='' || user.verifyOtp!==otp){
            return res.json({sucess:false,message:"Invalid OTP"})
        }
        if(user.verifyOtpExprireAt < Date.now()){
            return res.json({sucess:false,message:"OTP Expired"})
        }
        user.isAccountVerified = true;
        await user.save();
        return res.json({sucess:true,message:"Email verified successfully"})
    }catch(error){
        res.json({sucess:false,message:error.message})
    }
}

export const isAuthentication = async (req, res) =>{
    try{
        return res.json({success:true})
    }catch(error){
        res.json({sucess:false,message:error.message})
    }
}

export const sendResetOtp= async (req,res) =>{
    const {email}= req.body;
    if(!email){
        res.json({success:false,message:"Please enter a valid email"})
    }
    try{
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({
                success:false,
                message:"user not found"
            })
        }
        const otp = String(Math.floor(100000+Math.random()*900000))
        user.resetOtp = otp;
        user.resetOtpExprireAt = Date.now() + 15*60*1000;
        await user.save();
        const mailOptions ={
            from: process.env.SMTP_USER,
            to: user.email,
            subject:'Password Reset OTP',
            text:` Your Reset password OTP is ${otp} 
            use this password resetting user password`
        }
        await transporter.sendMail(mailOptions)
        res.json({success:true,message:"Your OTP Send to your Email"})
    }catch(error){
        res.json({
            success:false,
            message:error.message
        })
    }

}
export const resetPassword= async (req,res) =>{
    const {email,otp,newPassword}= req.body;
    if(!email||!otp||!newPassword){
        return res.json({success:false,message:"email or otp or new password required"});
    }
    try{
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({
                success:false,
                message:"user not found"
            })
        }
        if(user.resetOtp === ""||user.resetOtp!=otp){
            return res.json({success:false,message:"Invalid OTP"});
        }
        if(user.resetOtpExprireAt < Date.now()){
            return res.json({sucess:false,message:"OTP Expired"})
        }
        const hashpassword = await bcrypt.hash(newPassword,10)
        user.password=hashpassword;
        user.resetOtp=""
        user.resetOtpExprireAt=0
        await user.save()
        return res.json({sucess:true,message:"password has been reset successfully"})
    }catch(error){
        res.json({success:false,message:error.message});
    }
}
