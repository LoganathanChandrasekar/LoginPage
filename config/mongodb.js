import mongoose from "mongoose";


const connectDb = async()=>{
    mongoose.connection.on('connected', () => {
        console.log("Database Connected....");
    });
    
    await mongoose.connect(`${process.env.MONGODB}mern_auth`)
}


export default connectDb;