import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const url =  `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@bhubantodo.kaip10a.mongodb.net/?retryWrites=true&w=majority`

export const connectUsingMongoose = async () => {
    try {
        await mongoose.connect(url);
        console.log("Mongodb connected using mongoose");
    } catch (err) {
        console.log("Error while connecting to db");
        console.log(err);
    }
}