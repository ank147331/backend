import mongoose from "mongoose";
import { DB_name } from "../constant.js";


const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODBB_URI}/${DB_name}`);
        console.log(`/n database connected DB_host :  ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("database connection failed", error);
        process.exit(1)
    }
}

export default connectDB