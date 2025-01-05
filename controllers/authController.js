import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

export const register= async(req,res)=>{

    const{name,email,password}=req.body;

    if(!name||!email||!password){
        return res.json({
            success: false,
            message:"Missing Details"
        })
    }
    try{
        const existingUser=await userModel.findone({email})
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
        return res.json({success: true})
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
        const user=userModel.findOne({email})
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