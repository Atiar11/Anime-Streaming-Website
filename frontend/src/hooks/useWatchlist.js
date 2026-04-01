import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useWatchlist = () => {
	const [watchlist, setWatchlist] = useState([]);
	const [loading, setLoading] = useState(false);
	const { authUser } = useAuthContext();

	const getWatchlist = async () => {
		if (!authUser) return;
		setLoading(true);
		try {
			const res = await fetch("/api/watchlist", {
				credentials: "include",
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			setWatchlist(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getWatchlist();
	}, []);

	const addToWatchlist = async (anime) => {
		try {
			const res = await fetch("/api/watchlist/add", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					mal_id: anime.mal_id,
					title: anime.title,
					imageUrl: anime.images?.jpg?.image_url || anime.imageUrl,
					type: anime.type,
					score: anime.score,
					synopsis: anime.synopsis,
					trailerUrl: anime.trailer?.embed_url || anime.trailerUrl,
					episodes: anime.episodes,
					bannerUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || anime.bannerUrl,
				}),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			setWatchlist((prev) => [...prev, data]);
			toast.success("Added to watchlist!");
		} catch (error) {
			toast.error(error.message);
		}
	};

	const removeFromWatchlist = async (mal_id) => {
		try {
			const res = await fetch(`/api/watchlist/remove/${mal_id}`, {
				method: "DELETE",
				credentials: "include",
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			setWatchlist((prev) => prev.filter((item) => item.mal_id !== mal_id));
			toast.success("Removed from watchlist");
		} catch (error) {
			toast.error(error.message);
		}
	};

	const isInWatchlist = (mal_id) => {
		return watchlist.some((item) => item.mal_id === mal_id);
	};

	return { watchlist, loading, addToWatchlist, removeFromWatchlist, isInWatchlist };
};

export default useWatchlist;
