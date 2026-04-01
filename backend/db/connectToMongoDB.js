// import dotenv from "dotenv";
import "dotenv/config"; //import .env file
import mongoose from "mongoose";
// dotenv.config();

const connectToMongoDB = () => {
  mongoose
    .connect(process.env.MONGO_DB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    })
    .then(() => {
      console.log("Database Connected Successfully");
    })
    .catch((err) => {
      console.log("Database Connection Failed: " + err);
    });
};

export default connectToMongoDB;
