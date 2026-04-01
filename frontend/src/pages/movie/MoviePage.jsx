import React, { useEffect, useState } from "react";
import useSearchStore from "../../zustand/useSearchStore";
import FeaturedHero from "../../components/movie/FeaturedHero";
import useWatchlist from "../../hooks/useWatchlist";
import GenreShelf from "../../components/movie/GenreShelf";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import TrailerPlayer from "../../components/movie/TrailerPlayer";

const MoviePage = () => {
  const [animeList, setAnimeList] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const { searchQuery, setSearchQuery } = useSearchStore();
  const [cast, setCast] = useState([]);
  const [showPopular, setShowPopular] = useState(false);
  const [loading, setLoading] = useState(false);
  const [featuredAnime, setFeaturedAnime] = useState(null);
  const [genres, setGenres] = useState([]);
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const fetchData = async (query = "") => {
    setLoading(true);
    try {
      let url = "https://api.jikan.moe/v4/top/anime?filter=bypopularity";
      if (query.trim()) {
        url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&order_by=popularity`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const results = data?.data || [];
      setAnimeList(results);
      if (results.length > 0 && !query) {
        setFeaturedAnime(results[0]); // Set first trending as featured
        localStorage.setItem("featured-anime-cache", JSON.stringify({ data: results[0], timestamp: Date.now() }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load from cache for featured hero
    const cachedFeatured = localStorage.getItem("featured-anime-cache");
    if (cachedFeatured) {
      const { data, timestamp } = JSON.parse(cachedFeatured);
      if (Date.now() - timestamp < 3600000) {
        setFeaturedAnime(data);
      }
    }
  }, []);

  const fetchGenres = async () => {
    const cachedGenres = localStorage.getItem("genres-cache");
    if (cachedGenres) {
      const { data, timestamp } = JSON.parse(cachedGenres);
      if (Date.now() - timestamp < 3600000) {
        setGenres(data);
        return;
      }
    }

    try {
      const response = await fetch("https://api.jikan.moe/v4/genres/anime");
      const data = await response.json();
      
      // Sort genres by anime count and take top 20 for a rich experience
      const sortedGenres = data?.data
        ?.sort((a, b) => b.count - a.count)
        ?.slice(0, 20) || [];
        
      setGenres(sortedGenres);
      localStorage.setItem("genres-cache", JSON.stringify({ data: sortedGenres, timestamp: Date.now() }));
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Helper: fetch with retry on 429 rate-limit
  const fetchWithRetry = async (url, retries = 2) => {
    for (let i = 0; i <= retries; i++) {
      try {
        const res = await fetch(url);
        if (res.status === 429) {
          // Rate limited — wait longer each attempt
          await new Promise(resolve => setTimeout(resolve, 1200 * (i + 1)));
          continue;
        }
        if (res.ok) return res;
      } catch (e) {
        if (i === retries) throw e;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    return null;
  };

  const handleOpenModal = async (anime) => {
    // Show modal immediately with what we have (poster, title)
    setSelectedAnime(anime);
    setCast([]);
    document.getElementById("modalBtn").showModal();
    
    try {
      // Step 1: ALWAYS fetch full details — genre shelf cache can be incomplete
      const detailRes = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${anime.mal_id}`);
      if (detailRes) {
        const fullData = await detailRes.json();
        if (fullData?.data) {
          const data = fullData.data;
          // Fix: construct embed_url from youtube_id if embed_url is null
          if (!data.trailer?.embed_url && data.trailer?.youtube_id) {
            data.trailer = {
              ...data.trailer,
              embed_url: `https://www.youtube.com/embed/${data.trailer.youtube_id}?autoplay=0`,
            };
          }
          setSelectedAnime(data);
        }
      }

      // Step 2: Wait to avoid Jikan rate limit (3 req/s)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Fetch cast/characters
      const charRes = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${anime.mal_id}/characters`);
      if (charRes) {
        const charData = await charRes.json();
        setCast(charData?.data || []);
      }
    } catch (error) {
      console.error("Error in handleOpenModal:", error);
    }
  };


  const handleCloseModal = () => {
    document.getElementById("modalBtn").close();
    setSelectedAnime(null);
    setCast([]);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTogglePopular = () => {
    setShowPopular(!showPopular);
  };

  const filteredAnimeList = animeList.filter((anime) =>
    showPopular ? anime.score > 9 : true
  );

  return (
    <section className="min-h-full pb-20">
      {!searchQuery && (
        <FeaturedHero 
          anime={featuredAnime} 
          onOpenModal={handleOpenModal}
          onAddToWatchlist={addToWatchlist}
          onRemoveFromWatchlist={removeFromWatchlist}
          isInWatchlist={isInWatchlist}
        />
      )}

      {/* Watchlist Shelf */}
      {watchlist.length > 0 && !searchQuery && (
        <div className="px-8 mt-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-orbitron font-bold text-white text-xl tracking-[0.2em] crimson-glow-text uppercase">My Watchlist</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-blood-red/40 to-transparent"></div>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide">
            {watchlist.map((anime) => (
              <div 
                key={anime.mal_id} 
                className="flex-none w-40 group relative cursor-pointer"
                onClick={() => handleOpenModal(anime)}
              >
                <div className="relative aspect-[2/3] overflow-hidden border border-blood-red/20 group-hover:border-crimson-glow/60 transition-all">
                  <img src={anime.imageUrl} alt={anime.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                    <p className="text-[10px] text-white font-orbitron truncate w-full">{anime.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center py-12">
        <h1 className="inline-block text-5xl font-orbitron font-bold crimson-glow-text text-white relative">
          ANIME ARCHIVE
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-crimson-glow to-transparent animate-pulse"></div>
        </h1>
        <p className="mt-4 font-inter text-gray-500 uppercase tracking-widest text-xs">Exposing the pinnacle of Japanese Animation</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button
          onClick={handleTogglePopular}
          className={`font-orbitron text-xs px-6 py-3 border-2 transition-all duration-300 ${
            showPopular 
              ? 'bg-crimson-glow border-crimson-glow text-white shadow-crimson-outer' 
              : 'bg-transparent border-blood-red text-blood-red hover:bg-blood-red hover:text-white'
          }`}
        >
          {showPopular ? 'POPULARITY PEAK 🔥' : 'SHOW POPULAR'}
        </button>
        
        <div className="relative">
          <input
            type="text"
            placeholder="FILTER BY TITLE..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-dark-charcoal/80 border-2 border-blood-red/40 px-6 py-3 font-orbitron text-xs text-white focus:outline-none focus:border-crimson-glow w-64 md:w-80 transition-colors"
          />
        </div>

        <button
          onClick={() => setSearchQuery("")}
          className="font-orbitron text-xs px-6 py-3 border-2 border-gray-700 text-gray-500 hover:border-white hover:text-white transition-all"
        >
          RESET
        </button>
      </div>

      {/* Conditional Layout: Shelves vs Grid */}
      {!searchQuery ? (
        <div className="space-y-4">
          {genres.map((genre, index) => (
            <GenreShelf 
              key={genre.mal_id} 
              genre={genre} 
              onOpenModal={handleOpenModal} 
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-10 gap-1 w-full relative min-h-[400px] px-8">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-deep-black/40 z-10 backdrop-blur-sm">
              <span className="loading loading-spinner loading-lg text-crimson-glow"></span>
            </div>
          )}
          
          {filteredAnimeList.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center">
              <p className="font-orbitron text-gray-500 tracking-widest text-lg">NO ANIME FOUND IN ARCHIVE</p>
            </div>
          )}

          {filteredAnimeList.map((anime) => (
            <div
              key={anime.mal_id}
              className="group relative bg-deep-black border border-blood-red/20 overflow-hidden hover:border-crimson-glow/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-crimson-outer"
            >
              <div
                className="w-full aspect-[2/3] bg-center bg-cover transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${anime?.images?.jpg?.image_url})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-80"></div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-orbitron font-bold text-white text-lg leading-tight mb-4 crimson-glow-text shadow-black">
                  {anime.title}
                </h3>

                <button
                  onClick={() => handleOpenModal(anime)}
                  className="w-full py-3 bg-blood-red text-white font-orbitron text-[10px] tracking-widest hover:bg-crimson-glow transition-colors"
                >
                  WATCH
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <dialog id="modalBtn" className="modal backdrop-blur-sm">
        <div className="modal-box max-w-4xl bg-dark-charcoal border-2 border-crimson-glow p-0 rounded-none overflow-hidden">
          <button
            onClick={handleCloseModal}
            className="absolute right-4 top-4 z-10 text-white hover:text-crimson-glow transition-colors font-bold text-2xl"
          >
            ✕
          </button>
          
          {selectedAnime && (
            <div className="flex flex-col lg:flex-row h-full">
              <div className="lg:w-2/3 bg-black">
                <div className="aspect-video w-full h-full">
                  <TrailerPlayer anime={selectedAnime} />
                </div>
              </div>
              
              <div className="lg:w-1/3 p-8 bg-gradient-to-br from-dark-charcoal to-black overflow-y-auto max-h-[70vh] lg:max-h-[600px]">
                <h3 className="font-orbitron font-bold text-2xl text-crimson-glow mb-4 leading-tight">
                  {selectedAnime.title}
                </h3>

                <div className="flex gap-4 mb-6">
                  {isInWatchlist(selectedAnime.mal_id) ? (
                    <button 
                      onClick={() => removeFromWatchlist(selectedAnime.mal_id)}
                      className="flex items-center gap-2 bg-crimson-glow text-white text-[10px] font-orbitron px-4 py-2 hover:bg-blood-red transition-colors"
                    >
                      <IoBookmark className="text-lg" />
                      SAVED
                    </button>
                  ) : (
                    <button 
                      onClick={() => addToWatchlist(selectedAnime)}
                      className="flex items-center gap-2 bg-dark-charcoal border border-blood-red/40 text-white text-[10px] font-orbitron px-4 py-2 hover:border-crimson-glow transition-colors"
                    >
                      <IoBookmarkOutline className="text-lg" />
                      WATCHLIST
                    </button>
                  )}
                </div>
                
                <div className="space-y-4 font-inter text-sm text-gray-400">
                  <div className="border-l-2 border-blood-red pl-4">
                    <p className="text-[10px] uppercase tracking-widest text-blood-red font-bold">Category</p>
                    <p className="text-white italic">{selectedAnime.type}</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1 border-l-2 border-blood-red pl-4">
                      <p className="text-[10px] uppercase tracking-widest text-blood-red font-bold">Episodes</p>
                      <p className="text-white">{selectedAnime.episodes || 'N/A'}</p>
                    </div>
                    <div className="flex-1 border-l-2 border-blood-red pl-4">
                      <p className="text-[10px] uppercase tracking-widest text-blood-red font-bold">Rating</p>
                      <p className="text-white">{selectedAnime.score || 'Not Rated'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-blood-red font-bold mb-2">Cast Overview</p>
                    <div className="flex flex-wrap gap-2">
                       {cast && cast.length > 0 ? cast.slice(0, 5).map((character) => (
                        <span key={character.character.mal_id} className="text-[10px] bg-blood-red/20 text-gray-300 px-2 py-1 rounded-none border border-blood-red/40">
                          {character.character.name}
                        </span>
                      )) : (
                        <p className="text-[10px] text-gray-600 italic">Cast information not available for this entry.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-blood-red font-bold mb-2">Data Summary</p>
                    <p className="text-xs leading-relaxed text-gray-400 line-clamp-6">
                      {selectedAnime.synopsis || selectedAnime.description || "No full synopsis is available for this entry archive."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleCloseModal}>close</button>
        </form>
      </dialog>
    </section>
  );
};

export default MoviePage;
