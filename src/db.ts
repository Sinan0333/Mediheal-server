import mongoose from "mongoose";

const connectDB = async ():Promise<void> =>{
    try {
         const mongoUrl = process.env.MONGO_URL
         if(mongoUrl){
            await mongoose.connect(mongoUrl)
            console.log('Database Connected');
         }else{
            throw new Error("MONGO_URL is not defined in the environment variables.");
         }
    } catch (error) {
        console.log("Error in connecting to the Database",error);
    }
}

export default connectDB