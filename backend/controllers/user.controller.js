import mongoose from "mongoose";
import User from "../models/user.model.js";
import { mockUsersState } from "../utils/mockState.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		// --- MOCK MODE FALLBACK ---
		if (mongoose.connection.readyState !== 1) {
			console.log("Database not connected. Using Mock Mode for sidebar users.");
			const filteredMockUsers = mockUsersState.filter(user => user._id !== loggedInUserId);
			return res.status(200).json(filteredMockUsers);
		}
		// --- END MOCK MODE ---

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
