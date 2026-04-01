import React, { useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward, IoPlay } from "react-icons/io5";

const GenreShelf = ({ genre, onOpenModal, index }) => {
	const [animeList, setAnimeList] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchGenreAnime = async () => {
			const cacheKey = `genre-cache-${genre.mal_id}`;
			const cachedData = localStorage.getItem(cacheKey);
			
			if (cachedData) {
				const { data, timestamp } = JSON.parse(cachedData);
				// Use cache if it's less than 1 hour old
				if (Date.now() - timestamp < 3600000) {
					setAnimeList(data);
					setLoading(false);
					return;
				}
			}

			try {
				const response = await fetch(
					`https://api.jikan.moe/v4/anime?genres=${genre.mal_id}&order_by=popularity&sort=desc&limit=20`
				);
				if (!response.ok) throw new Error("API Limit");
				const data = await response.json();
				const results = data?.data || [];
				
				setAnimeList(results);
				// Save to cache
				localStorage.setItem(cacheKey, JSON.stringify({ data: results, timestamp: Date.now() }));
			} catch (error) {
				console.error(`Error fetching genre ${genre.name}:`, error);
			} finally {
				setLoading(false);
			}
		};

		// Staggered delay based on index to avoid hitting 3 req/sec concurrently (600ms intervals)
		// Only delay if we don't have a cache
		const cacheKey = `genre-cache-${genre.mal_id}`;
		const hasCache = localStorage.getItem(cacheKey);
		const delay = hasCache ? 0 : index * 600;

		const timer = setTimeout(fetchGenreAnime, delay);
		return () => clearTimeout(timer);
	}, [genre.mal_id, index]);

	const scroll = (direction) => {
		const container = document.getElementById(`shelf-${genre.mal_id}`);
		const scrollAmount = direction === "left" ? -400 : 400;
		container.scrollBy({ left: scrollAmount, behavior: "smooth" });
	};

	if (!loading && animeList.length === 0) return null;

	return (
		<div className="px-8 mt-16 group/shelf">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					<h2 className="font-orbitron font-bold text-white text-xl tracking-[0.2em] crimson-glow-text uppercase">
						{genre.name}
					</h2>
					<div className="h-[1px] w-24 bg-gradient-to-r from-blood-red/40 to-transparent"></div>
				</div>
				
				<div className="flex gap-2 opacity-0 group-hover/shelf:opacity-100 transition-opacity">
					<button 
						onClick={() => scroll("left")}
						className="p-2 bg-dark-charcoal border border-blood-red/30 text-white hover:bg-blood-red transition-all"
					>
						<IoChevronBack />
					</button>
					<button 
						onClick={() => scroll("right")}
						className="p-2 bg-dark-charcoal border border-blood-red/30 text-white hover:bg-blood-red transition-all"
					>
						<IoChevronForward />
					</button>
				</div>
			</div>

			<div 
				id={`shelf-${genre.mal_id}`}
				className="flex overflow-x-auto gap-4 pb-8 scrollbar-hide snap-x scroll-smooth no-scrollbar"
			>
				{loading ? (
					[...Array(6)].map((_, i) => (
						<div key={i} className="flex-none w-[200px] aspect-[2/3] bg-dark-charcoal/50 animate-pulse border border-blood-red/10"></div>
					))
				) : (
					animeList.map((anime) => (
						<div
							key={anime.mal_id}
							className="flex-none w-[200px] snap-start group relative cursor-pointer bg-deep-black border border-blood-red/20 overflow-hidden hover:border-crimson-glow/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-crimson-outer"
						>
							{/* Poster Image */}
							<div
								className="w-full aspect-[2/3] bg-center bg-cover transition-transform duration-700 group-hover:scale-110"
								style={{ backgroundImage: `url(${anime?.images?.jpg?.image_url})` }}
							>
							</div>

							{/* Hover Overlay with visible ACCESS TRAILER button */}
							<div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
								<h3 className="font-orbitron font-bold text-white text-[10px] leading-tight mb-3 line-clamp-2">
									{anime.title}
								</h3>
								<div className="flex justify-between items-center mb-3">
									<span className="text-[8px] text-crimson-glow font-bold uppercase">{anime.type}</span>
									<span className="text-[8px] text-yellow-400">★ {anime.score || 'N/A'}</span>
								</div>
								<button
									onClick={() => onOpenModal(anime)}
									className="w-full flex items-center justify-center gap-2 py-2 bg-blood-red text-white font-orbitron text-[9px] tracking-widest hover:bg-crimson-glow transition-colors"
								>
									<IoPlay className="text-xs" />
									WATCH
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default GenreShelf;
