import { IoMdPlay, IoMdPause } from "react-icons/io";
import { FiHeart, FiMusic } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useMusic } from "../context/MusicContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { useEffect, useState, useRef } from "react";
import { musicApi } from "../api/musicApi";

const Home = () => {
  const { user } = useUser();
  const { music, loading } = useMusic();
  const [isLiked, setIsLiked] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [isPlaying, setIsPlaying] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const initialLikes = {};
    music.forEach((track) => {
      initialLikes[track._id] = track.isLiked || false;
    });
    setIsLiked(initialLikes);
  }, [music]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, [currentTrack]);

  const handleAudioEnd = () => {
    setIsPlaying(null);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickTime = (clickX / width) * audio.duration;

    audio.currentTime = clickTime;
    setProgress((clickTime / audio.duration) * 100);
    setCurrentTime(clickTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLike = async (id) => {
    try {
      setIsLiked((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
      
      const res = await musicApi.likeMusic(id);
      console.log(res.data.message);
    } catch (error) {
      console.log("error while liking the song: ", error.response);
      // Revert on error
      setIsLiked((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const handlePlay = (track) => {
    setCurrentTrack(track);
    setIsPlaying(track._id);
    setShowPlayer(true);
    
    // Reset progress when starting a new track
    setProgress(0);
    setCurrentTime(0);
    
    // Small delay to ensure audio element is ready
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.log("Audio play failed:", error);
        });
      }
    }, 100);
  };

  const handlePause = () => {
    setIsPlaying(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const likedMusic = music.filter(track => isLiked[track._id]);
  const displayMusic = activeTab === "liked" ? likedMusic : music;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      },
    },
  };

  const getGenreColor = (genre) => {
    const genreColors = {
      pop: "bg-gradient-to-r from-pink-500 to-rose-500",
      rock: "bg-gradient-to-r from-red-500 to-orange-500",
      hiphop: "bg-gradient-to-r from-purple-500 to-indigo-500",
      jazz: "bg-gradient-to-r from-yellow-500 to-amber-500",
      electronic: "bg-gradient-to-r from-blue-500 to-cyan-500",
      classical: "bg-gradient-to-r from-indigo-500 to-purple-500",
      rnb: "bg-gradient-to-r from-orange-500 to-red-500",
      country: "bg-gradient-to-r from-green-500 to-emerald-500",
      chill: "bg-gradient-to-r from-teal-500 to-blue-500",
      default: "bg-gradient-to-r from-gray-600 to-gray-500",
    };

    return genreColors[genre?.toLowerCase()] || genreColors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
          <p className="text-gray-400">Loading your music...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pb-24">
      <Navbar user={{ role: user.role }} />

      {/* Audio element for playback */}
      <audio 
        ref={audioRef} 
        src={currentTrack?.musicUrl} 
        preload="metadata"
      />

      <main className="p-4 max-w-7xl mx-auto">
        {/* Header with Welcome */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-white mb-1">
            Welcome back, {user?.fullname?.split(' ')[0] || "Listener"} 👋
          </h1>
          <p className="text-gray-400 text-sm">
            Ready to discover some amazing music?
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide"
        >
          {["all", "liked"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              {tab === "all" ? "All Music" : "Liked Songs"}
            </button>
          ))}
        </motion.div>

        {/* Music Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {displayMusic.length > 0 ? (
              displayMusic.map((track) => (
                <motion.div
                  key={track._id}
                  variants={cardVariants}
                  layout
                  whileHover={{
                    y: -4,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-800/30 backdrop-blur-lg rounded-3xl p-4 group cursor-pointer relative overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                >
                  {/* Cover Art with Play Button */}
                  <div className="relative mb-4 rounded-2xl overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={track.coverArtUrl}
                      alt={track.title}
                      className="w-full aspect-square object-cover rounded-2xl transition-transform duration-500"
                    />

                    {/* Play Button Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-400 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          isPlaying === track._id ? handlePause() : handlePlay(track);
                        }}
                      >
                        {isPlaying === track._id ? (
                          <IoMdPause className="text-white text-xl" />
                        ) : (
                          <IoMdPlay className="text-white text-xl ml-1" />
                        )}
                      </motion.button>
                    </motion.div>

                    {/* Genre Badge */}
                    {track.genre && (
                      <div
                        className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getGenreColor(
                          track.genre
                        )} text-white shadow-lg`}
                      >
                        {track.genre}
                      </div>
                    )}
                  </div>

                  {/* Song Info */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate text-sm mb-1">
                        {track.title}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">
                        {track.artist}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1 ml-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(track._id);
                        }}
                      >
                        {isLiked[track._id] ? (
                          <AiFillHeart className="text-green-500 text-lg" />
                        ) : (
                          <FiHeart className="text-gray-400 hover:text-green-500 text-lg transition-colors" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Active Playing Indicator */}
                  {isPlaying === track._id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"
                    />
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full text-center py-12"
              >
                <FiMusic className="text-gray-500 text-4xl mx-auto mb-4" />
                <div className="text-gray-400 text-lg">
                  {activeTab === "liked" ? "No liked songs yet" : "No music available"}
                </div>
                <p className="text-gray-500 mt-2 text-sm">
                  {activeTab === "liked" 
                    ? "Start liking songs to see them here!" 
                    : "Artists haven't uploaded any music yet."}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Player Bar */}
      <AnimatePresence>
        {showPlayer && currentTrack && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-lg border-t border-gray-700"
          >
            {/* Progress Bar */}
            <div 
              className="w-full h-1 bg-gray-600 cursor-pointer"
              onClick={handleProgressClick}
            >
              <motion.div 
                className="h-full bg-green-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>

            <div className="p-4 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <img
                    src={currentTrack.coverArtUrl}
                    alt={currentTrack.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm truncate">
                      {currentTrack.title}
                    </h4>
                    <p className="text-gray-400 text-xs truncate">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>
                
                {/* Time Display */}
                <div className="flex items-center space-x-2 mx-4">
                  <span className="text-xs text-gray-400 min-w-[35px]">
                    {formatTime(currentTime)}
                  </span>
                  <span className="text-xs text-gray-500">/</span>
                  <span className="text-xs text-gray-400 min-w-[35px]">
                    {formatTime(duration)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(currentTrack._id)}
                    className="p-2"
                  >
                    {isLiked[currentTrack._id] ? (
                      <AiFillHeart className="text-green-500 text-xl" />
                    ) : (
                      <FiHeart className="text-gray-400 text-xl hover:text-green-500 transition-colors" />
                    )}
                  </button>
                  
                  <button
                    onClick={isPlaying ? handlePause : () => handlePlay(currentTrack)}
                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors shadow-lg"
                  >
                    {isPlaying ? (
                      <IoMdPause className="text-white text-lg" />
                    ) : (
                      <IoMdPlay className="text-white text-lg ml-1" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;