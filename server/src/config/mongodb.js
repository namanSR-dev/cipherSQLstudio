import mongoose from "mongoose";
/* 
  Using the promise based approach - Avoid multiple connection.
*/
export const connectMongoDB = async () => {
  try {
    // We "await" the promise returned by mongoose.connect
    await mongoose.connect(process.env.MONGO_URI); 

    console.log("MongoDB connected");
  } catch (error) {
    // If the promise rejects, we catch the error here
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};