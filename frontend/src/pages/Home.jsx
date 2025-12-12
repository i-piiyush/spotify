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

const Home = ({ socket }) => {
  const { user } = useUser();
  const { music, loading } = useMusic();
  const [isLiked, setIsLiked] = useState({});
  const [activeTab, setActiveTab] = useState("all");


  const navigate = useNavigate();

  useEffect(() => {
    const initialLikes = {};
    (music || []).forEach((track) => {
      initialLikes[track._id] = track.isLiked || false;
    });
    setIsLiked(initialLikes);
  }, [music]);

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

  const likedMusic = (music || []).filter((track) =>
    Boolean(isLiked?.[track._id])
  );

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
        ease: "easeOut",
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

      <main className="p-4 max-w-7xl mx-auto">
        {/* Header with Welcome */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-white mb-1">
            Welcome back, {user?.fullname?.split(" ")[0] || "Listener"} 👋
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
                          socket?.emit("play", { musicId: track._id });
                          navigate(`music/${track._id}`);
                        }}
                      >
                       
                          <IoMdPlay className="text-white text-xl ml-1" />
                      
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
                  {activeTab === "liked"
                    ? "No liked songs yet"
                    : "No music available"}
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
    </div>
  );
};

export default Home;
