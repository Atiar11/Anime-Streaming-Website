import React, { useEffect, useState } from "react";

const MoviePage = () => {
  const [animeList, setAnimeList] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cast, setCast] = useState([]);
  const [showPopular, setShowPopular] = useState(false); // State to track if "Popular" option is selected

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.jikan.moe/v4/top/anime?filter=bypopularity"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAnimeList(data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = async (anime) => {
    setSelectedAnime(anime);
    document.getElementById("modalBtn").showModal();
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${anime.mal_id}/characters`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCast(data?.data);
    } catch (error) {
      console.error("Error fetching cast data:", error);
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
    (showPopular ? anime.score > 9 : true) && anime.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="min-h-full pb-20">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-10 gap-1 w-full">
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
                ACCESS TRAILER
              </button>
            </div>
          </div>
        ))}
      </div>

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
                <div className="aspect-video w-full h-full flex items-center justify-center">
                  <iframe
                    title={selectedAnime.title}
                    width="100%"
                    height="100%"
                    src={selectedAnime?.trailer?.embed_url}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="border-none"
                  ></iframe>
                </div>
              </div>
              
              <div className="lg:w-1/3 p-8 bg-gradient-to-br from-dark-charcoal to-black overflow-y-auto max-h-[70vh] lg:max-h-[600px]">
                <h3 className="font-orbitron font-bold text-2xl text-crimson-glow mb-6 leading-tight">
                  {selectedAnime.title}
                </h3>
                
                <div className="space-y-4 font-inter text-sm text-gray-400">
                  <div className="border-l-2 border-blood-red pl-4">
                    <p className="text-[10px] uppercase tracking-widest text-blood-red font-bold">Category</p>
                    <p className="text-white italic">{selectedAnime.type}</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1 border-l-2 border-blood-red pl-4">
                      <p className="text-[10px] uppercase tracking-widest text-blood-red font-bold">Episodes</p>
                      <p className="text-white">{selectedAnime.episodes || '??'}</p>
                    </div>
                    <div className="flex-1 border-l-2 border-blood-red pl-4">
                      <p className="text-[10px] uppercase tracking-widest text-blood-red font-bold">Rating</p>
                      <p className="text-white">{selectedAnime.score}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-blood-red font-bold mb-2">Cast Overview</p>
                    <div className="flex flex-wrap gap-2">
                       {cast.slice(0, 5).map((character) => (
                        <span key={character.character.mal_id} className="text-[10px] bg-blood-red/20 text-gray-300 px-2 py-1 rounded-none border border-blood-red/40">
                          {character.character.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-blood-red font-bold mb-2">Data Summary</p>
                    <p className="text-xs leading-relaxed text-gray-500 line-clamp-6">
                      {selectedAnime.synopsis}
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
