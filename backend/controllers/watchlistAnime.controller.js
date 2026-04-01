import mongoose from "mongoose";
import WatchlistAnime from "../models/watchlistAnime.model.js";
import fs from "fs";
import path from "path";

// --- MOCK FILE-BASED STORAGE ---
const MOCK_DB_PATH = path.resolve("backend/data/watchlist_db.json");

// Ensure directory exists
const dir = path.dirname(MOCK_DB_PATH);
if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir, { recursive: true });
}

const readMockData = () => {
	if (!fs.existsSync(MOCK_DB_PATH)) return {};
	try {
		const data = fs.readFileSync(MOCK_DB_PATH, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		console.error("Error reading mock DB:", error);
		return {};
	}
};

const writeMockData = (data) => {
	try {
		fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2));
	} catch (error) {
		console.error("Error writing mock DB:", error);
	}
};
// -----------------------------

export const addToWatchlist = async (req, res) => {
	try {
		const { mal_id, title, imageUrl, type, score, synopsis, trailerUrl, episodes, bannerUrl } = req.body;
		const userId = req.user._id;

		// --- MOCK MODE FALLBACK ---
		if (mongoose.connection.readyState !== 1) {
			console.log("Database not connected. Using Persistent Mock Mode for adding to anime watchlist.");
			const mockDB = readMockData();
			const userWatchlist = mockDB[userId.toString()] || [];
			
			const existing = userWatchlist.find(item => item.mal_id === mal_id);
			if (existing) {
				return res.status(400).json({ error: "Anime already in watchlist" });
			}
			
			const newMockItem = { 
				userId, 
				mal_id, 
				title, 
				imageUrl, 
				type, 
				score, 
				synopsis,
				trailerUrl,
				episodes,
				bannerUrl,
				_id: "mock-anime-wish-" + Date.now() 
			};
			
			mockDB[userId.toString()] = [...userWatchlist, newMockItem];
			writeMockData(mockDB);
			
			return res.status(201).json(newMockItem);
		}
		// --- END MOCK MODE ---

		const watchlistItem = new WatchlistAnime({
			userId,
			mal_id,
			title,
			imageUrl,
			type,
			score,
			synopsis,
			trailerUrl,
			episodes,
			bannerUrl,
		});

		await watchlistItem.save();
		res.status(201).json(watchlistItem);
	} catch (error) {
		console.error("Error in addToWatchlist controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const removeFromWatchlist = async (req, res) => {
	try {
		const { mal_id } = req.params;
		const userId = req.user._id;

		// --- MOCK MODE FALLBACK ---
		if (mongoose.connection.readyState !== 1) {
			console.log("Database not connected. Using Persistent Mock Mode for removing from anime watchlist.");
			const mockDB = readMockData();
			const userWatchlist = mockDB[userId.toString()] || [];
			
			const index = userWatchlist.findIndex(item => item.mal_id === Number(mal_id));
			if (index !== -1) {
				userWatchlist.splice(index, 1);
				mockDB[userId.toString()] = userWatchlist;
				writeMockData(mockDB);
				return res.status(200).json({ message: "Removed from watchlist" });
			}
			return res.status(404).json({ error: "Item not found in watchlist" });
		}
		// --- END MOCK MODE ---

		const deletedItem = await WatchlistAnime.findOneAndDelete({ userId, mal_id });

		if (!deletedItem) {
			return res.status(404).json({ error: "Item not found in watchlist" });
		}

		res.status(200).json({ message: "Removed from watchlist" });
	} catch (error) {
		console.error("Error in removeFromWatchlist controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getWatchlist = async (req, res) => {
	try {
		const userId = req.user._id;

		// --- MOCK MODE FALLBACK ---
		if (mongoose.connection.readyState !== 1) {
			console.log("Database not connected. Using Persistent Mock Mode for getting anime watchlist.");
			const mockDB = readMockData();
			return res.status(200).json(mockDB[userId.toString()] || []);
		}
		// --- END MOCK MODE ---

		const watchlist = await WatchlistAnime.find({ userId });
		res.status(200).json(watchlist);
	} catch (error) {
		console.error("Error in getWatchlist controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
