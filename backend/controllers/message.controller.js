import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// --- MOCK IN-MEMORY STORAGE ---
const mockMessagesStore = new Map(); // key: conversationId, value: messages array
// -----------------------------

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		// --- MOCK MODE FALLBACK ---
		if (mongoose.connection.readyState !== 1) {
			console.log("Database not connected. Using Mock Mode for sending messages.");
			const newMessage = {
				_id: "mock-msg-" + Date.now(),
				senderId,
				receiverId,
				message,
				createdAt: new Date(),
			};

			const conversationKey = [senderId, receiverId].sort().join("-");
			if (!mockMessagesStore.has(conversationKey)) {
				mockMessagesStore.set(conversationKey, []);
			}
			mockMessagesStore.get(conversationKey).push(newMessage);

			const receiverSocketId = getReceiverSocketId(receiverId);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("newMessage", newMessage);
			}

			return res.status(201).json(newMessage);
		}
		// --- END MOCK MODE ---

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// await conversation.save();
		// await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		// --- MOCK MODE FALLBACK ---
		if (mongoose.connection.readyState !== 1) {
			console.log("Database not connected. Using Mock Mode for fetching messages.");
			const conversationKey = [senderId, userToChatId].sort().join("-");
			return res.status(200).json(mockMessagesStore.get(conversationKey) || []);
		}
		// --- END MOCK MODE ---

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
