import userModel from "../models/userModel.js";

export const getUserData=async (req, res, next) => {
    try{
         const {userId}= req.body;
         const user = await userModel.findById(userId);
         if(!user) {
            return res.json({
                success: false,
                message: "User not found"});
        }
         return res.json({
            success: true,
            message: 
        {
         name: user.name,
         verified: user.verified
        }});;
    }catch(error){
        return res.json({
            success: false,
            message: error.message});
    }
}