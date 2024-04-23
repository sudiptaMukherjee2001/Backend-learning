import mongoose from "mongoose";
import databaseName from "../constant.js";

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}/${databaseName}`);
        console.log("Database connected successfuly");
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR", error);
    }

}

export default connectDb;