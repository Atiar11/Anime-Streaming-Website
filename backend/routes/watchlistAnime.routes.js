import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
	addToWatchlist,
	removeFromWatchlist,
	getWatchlist,
} from "../controllers/watchlistAnime.controller.js";

const router = express.Router();

router.get("/", protectRoute, getWatchlist);
router.post("/add", protectRoute, addToWatchlist);
router.delete("/remove/:mal_id", protectRoute, removeFromWatchlist);

export default router;
