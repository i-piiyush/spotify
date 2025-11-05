import { IoMdPlay } from "react-icons/io";
import { FiHeart, FiMoreHorizontal } from "react-icons/fi";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useMusic } from "../context/MusicContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useUser();
  const { music, loading } = useMusic();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Function to get genre color
  const getGenreColor = (genre) => {
    const genreColors = {
      pop: "bg-pink-500",
      rock: "bg-red-500",
      hiphop: "bg-purple-500",
      jazz: "bg-yellow-500",
      electronic: "bg-blue-500",
      classical: "bg-indigo-500",
      rnb: "bg-orange-500",
      country: "bg-green-600",
      default: "bg-gray-600",
    };

    return genreColors[genre.toLowerCase()] || genreColors.default;
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar user={{ role: user.role }} />

      <main className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Good evening, {user?.fullname || "Listener"}
          </h1>
          <p className="text-gray-400">
            Discover new music from your favorite artists
          </p>
        </div>

        {/* Music Grid */}
        {music && music.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {music.map((track, index) => (
              <motion.div
                key={track._id}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className="bg-gray-800 rounded-2xl p-4 group cursor-pointer relative overflow-hidden hover:bg-gray-750 transition-all duration-300"
                onClick={() => {
                  navigate(`/play/${track._id}`);
                }}
              >
                {/* Cover Art */}
                <div className="relative mb-4 rounded-xl overflow-hidden">
                  <img
                    src={track.coverArtUrl || "/api/placeholder/300/300"}
                    alt={track.title}
                    className="w-full aspect-square object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Play Button Overlay */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-start p-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-400 transition-colors"
                    >
                      <IoMdPlay className="text-white text-lg ml-1" />
                    </motion.button>
                  </motion.div>

                  {/* Genre Badge */}
                  {track.genre && (
                    <div
                      className={`absolute top-3 left-3 px-4 py-1 flex justify-center items-center rounded-full text-xs font-light  ${getGenreColor(
                        track.genre
                      )} text-white backdrop-blur-sm bg-opacity-90`}
                    >
                      {track.genre}
                    </div>
                  )}
                </div>

                {/* Song Info */}
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate mb-1">
                      {track.title}
                    </h3>
                    <p className="text-gray-400 text-sm truncate mb-2">
                      {track.artist}
                    </p>

                    {/* Genre for mobile/alternative display */}
                    {track.genre && (
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                          {track.genre}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <FiHeart className="text-gray-400 hover:text-green-500 transition-colors" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <FiMoreHorizontal className="text-gray-400 hover:text-white transition-colors" />
                    </motion.button>
                  </div>
                </div>

                {/* Green Accent Bar */}
                <motion.div
                  className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 to-green-300 group-hover:w-full transition-all duration-500"
                  initial={{ width: 0 }}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No music available</div>
            <p className="text-gray-500 mt-2">
              Artists haven't uploaded any music yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
