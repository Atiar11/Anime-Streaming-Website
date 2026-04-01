import React from "react";
import { IoPlay, IoAdd, IoCheckmark } from "react-icons/io5";

const FeaturedHero = ({ anime, onOpenModal, onAddToWatchlist, onRemoveFromWatchlist, isInWatchlist }) => {
	if (!anime) return null;

	return (
		<div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden group">
			{/* Background Image with Gradient Overlay */}
			<div 
				className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
				style={{ backgroundImage: `url(${anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url})` }}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-deep-black via-deep-black/60 to-transparent"></div>
				<div className="absolute inset-0 bg-gradient-to-t from-deep-black to-transparent"></div>
			</div>

			{/* Content */}
			<div className="relative h-full flex flex-col justify-center px-12 md:px-24">
				<div className="max-w-2xl space-y-6">
					<div className="flex items-center gap-4">
						<span className="bg-blood-red text-white text-[10px] font-orbitron font-bold px-3 py-1 tracking-widest uppercase">
							Featured Content
						</span>
						<span className="text-crimson-glow font-orbitron text-[10px] tracking-widest uppercase">
							{anime.type} • {anime.episodes || "?"} Episodes
						</span>
					</div>

					<h1 className="text-5xl md:text-7xl font-orbitron font-bold text-white leading-tight crimson-glow-text drop-shadow-2xl">
						{anime.title}
					</h1>

					<p className="text-gray-300 font-inter text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-4 max-w-xl">
						{anime.synopsis}
					</p>

					<div className="flex flex-wrap gap-4 pt-4">
						<button 
							onClick={() => onOpenModal(anime)}
							className="flex items-center gap-2 bg-white text-black hover:bg-crimson-glow hover:text-white transition-all duration-300 font-orbitron font-bold px-8 py-3 tracking-widest text-sm shadow-xl"
						>
							<IoPlay className="text-xl" />
							WATCH TRAILER
						</button>
						
						{isInWatchlist(anime.mal_id) ? (
							<button 
								onClick={() => onRemoveFromWatchlist(anime.mal_id)}
								className="flex items-center gap-2 bg-dark-charcoal/80 text-white border-2 border-crimson-glow transition-all duration-300 font-orbitron font-bold px-8 py-3 tracking-widest text-sm"
							>
								<IoCheckmark className="text-xl" />
								IN WATCHLIST
							</button>
						) : (
							<button 
								onClick={() => onAddToWatchlist(anime)}
								className="flex items-center gap-2 bg-dark-charcoal/80 text-white border-2 border-blood-red/40 hover:border-crimson-glow transition-all duration-300 font-orbitron font-bold px-8 py-3 tracking-widest text-sm"
							>
								<IoAdd className="text-xl" />
								ADD TO WATCHLIST
							</button>
						)}
					</div>
				</div>
			</div>
			
			{/* Bottom Decorative Edge */}
			<div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-deep-black to-transparent"></div>
		</div>
	);
};

export default FeaturedHero;
