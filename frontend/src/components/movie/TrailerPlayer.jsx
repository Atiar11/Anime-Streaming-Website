import React, { useState, useEffect } from "react";

/**
 * Smart Trailer Player with YouTube search fallback
 * 
 * Priority:
 *   1. Official trailer → use Jikan's embed_url (has autoplay=1 built in)
 *   2. Construct from youtube_id if embed_url missing
 *   3. Watchlist stored trailerUrl
 *   4. No trailer → embed YouTube search results for the anime (shows clips, previews, etc.)
 * 
 * On confirmed YouTube error (100/101/150) → fall through to next source
 */
const TrailerPlayer = ({ anime }) => {
  const [useSearchFallback, setUseSearchFallback] = useState(false);
  const prevMalIdRef = React.useRef(null);

  // Reset when a different anime is opened
  useEffect(() => {
    if (anime?.mal_id !== prevMalIdRef.current) {
      prevMalIdRef.current = anime?.mal_id;
      setUseSearchFallback(false);
    }
  }, [anime?.mal_id]);

  // Listen for real YouTube errors → fall back to search
  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        // Error codes: 100=not found, 101/150=not embeddable
        if (data.event === "onError" && [100, 101, 150].includes(data.info)) {
          setUseSearchFallback(true);
        }
      } catch {
        // ignore non-YouTube messages
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const title = anime?.title || "";

  // --- Build official trailer URL ---
  const getTrailerUrl = () => {
    const embedUrl = anime?.trailer?.embed_url;
    const youtubeId = anime?.trailer?.youtube_id;
    const watchlistUrl = anime?.trailerUrl;

    if (embedUrl) {
      return embedUrl
        .replace("www.youtube.com/embed", "www.youtube-nocookie.com/embed")
        .replace("autoplay=0", "autoplay=1")
        + (embedUrl.includes("autoplay=") ? "" : "&autoplay=1");
    }
    if (youtubeId) {
      return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&enablejsapi=1&rel=0`;
    }
    if (watchlistUrl) return watchlistUrl;
    return null;
  };

  const trailerUrl = getTrailerUrl();
  const hasOfficialTrailer = Boolean(trailerUrl);

  // --- YouTube search embed (fallback when no official trailer, or on error) ---
  // Shows the top YouTube results for the anime — clips, previews, reactions, etc.
  const searchQuery = encodeURIComponent(title + " anime");
  const youtubeSearchUrl = `https://www.youtube.com/embed?listType=search&list=${searchQuery}&autoplay=1&rel=0`;

  // Decide which source to show
  const activeUrl = (hasOfficialTrailer && !useSearchFallback)
    ? trailerUrl
    : youtubeSearchUrl;

  return (
    <div className="relative w-full h-full bg-black">
      {/* Label to tell user what they're watching */}
      {!hasOfficialTrailer || useSearchFallback ? (
        <div className="absolute top-2 left-2 z-20 bg-black/70 border border-blood-red/40 px-3 py-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-crimson-glow rounded-full animate-pulse inline-block"></span>
          <span className="font-orbitron text-[8px] text-gray-400 tracking-widest uppercase">
            Clips &amp; Previews
          </span>
        </div>
      ) : (
        <div className="absolute top-2 left-2 z-20 bg-black/70 border border-blood-red/40 px-3 py-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blood-red rounded-full animate-pulse inline-block"></span>
          <span className="font-orbitron text-[8px] text-crimson-glow tracking-widest uppercase">
            Official Trailer
          </span>
        </div>
      )}

      <iframe
        key={activeUrl}
        title={title}
        width="100%"
        height="100%"
        src={activeUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="border-none w-full h-full"
      />
    </div>
  );
};

export default TrailerPlayer;
