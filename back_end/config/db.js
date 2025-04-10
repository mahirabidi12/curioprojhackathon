import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected To Database`);
  } catch (error) {
    console.log("Could Not Connect To Database");
  }
} 

export default connectDb;
