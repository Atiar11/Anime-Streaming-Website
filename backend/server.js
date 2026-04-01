import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config"; //import .env file
import express from "express";
import connectToMongoDB from "./db/connectToMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import storeRoutes from "./routes/store.routes.js";
import userRoutes from "./routes/user.routes.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

// connect database
const maskedURI = process.env.MONGO_DB_URI ? process.env.MONGO_DB_URI.replace(/:([^@]+)@/, ":****@") : "MISSING";
console.log("Connecting to MongoDB with URI: " + maskedURI);
connectToMongoDB();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/store", storeRoutes);

server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
