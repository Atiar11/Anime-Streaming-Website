import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		// --- MOCK MODE FALLBACK ---
		if (mongoose.connection.readyState !== 1) {
			console.log("Database not connected. Using Mock Mode in protectRoute.");
			if (decoded.userId.startsWith("mock-")) {
				req.user = {
					_id: decoded.userId,
					username: decoded.userId === "mock-admin-id" ? "admin" : "user",
					fullName: decoded.userId === "mock-admin-id" ? "Mock Admin" : "Mock User",
					role: decoded.userId === "mock-admin-id" ? "admin" : "user",
				};
				return next();
			}
		}
		// --- END MOCK MODE ---

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectRoute;
