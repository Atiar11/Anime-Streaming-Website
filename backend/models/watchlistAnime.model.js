import mongoose from "mongoose";

const watchlistAnimeSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		mal_id: {
			type: Number,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		type: {
			type: String,
		},
		score: {
			type: Number,
		},
		synopsis: {
			type: String,
		},
		trailerUrl: {
			type: String,
		},
		episodes: {
			type: Number,
		},
		bannerUrl: {
			type: String,
		},
	},
	{ timestamps: true }
);

// Prevent duplicate entries for the same user and anime
watchlistAnimeSchema.index({ userId: 1, mal_id: 1 }, { unique: true });

const WatchlistAnime = mongoose.model("WatchlistAnime", watchlistAnimeSchema);

export default WatchlistAnime;
