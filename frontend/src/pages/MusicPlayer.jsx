import React from 'react';
import { motion } from 'framer-motion';
import { 
  IoPlay, 
  IoPause, 
  IoPlaySkipBack, 
  IoPlaySkipForward,
  IoVolumeHigh,
  IoHeart,
  IoHeartOutline,
  IoShareSocial,
  IoList,
  IoRepeat,
  IoShuffle
} from 'react-icons/io5';
import { FiChevronLeft } from 'react-icons/fi';

const MusicPlayer = () => {
  // Static demo data
  const currentTrack = {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 203,
    coverArtUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    genre: 'Synthwave',
    likes: 1250432,
    releaseYear: 2020
  };

  // Static UI states
  const isPlaying = true;
  const isLiked = true;
  const progress = 45; // 45% played
  const volume = 70; // 70% volume
  const currentTime = 91; // 1:31 minutes
  const duration = 203; // 3:23 minutes

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="p-6">
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <FiChevronLeft className="text-2xl" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Album Art Section */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center"
          >
            <div className="relative">
              <img
                src={currentTrack.coverArtUrl}
                alt={currentTrack.title}
                className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl shadow-2xl object-cover"
              />
              <div className="absolute inset-0 rounded-3xl shadow-2xl border-2 border-white/10"></div>
            </div>
          </motion.div>

          {/* Track Info & Controls */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Track Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                  {currentTrack.title}
                </h1>
                <p className="text-2xl text-gray-300 mb-2">
                  {currentTrack.artist}
                </p>
                <p className="text-gray-400">
                  {currentTrack.album} • {currentTrack.releaseYear}
                </p>
              </div>

              {/* Genre & Likes */}
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                  {currentTrack.genre}
                </span>
                <span className="text-gray-400 text-sm">
                  {currentTrack.likes.toLocaleString()} likes
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-1 bg-gray-700 rounded-lg relative">
                <div 
                  className="h-1 bg-white rounded-lg absolute top-0 left-0"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button className="p-3 hover:bg-gray-800 rounded-full transition-colors">
                  <IoShuffle className="text-2xl text-gray-400" />
                </button>
                <button className="p-3 hover:bg-gray-800 rounded-full transition-colors">
                  <IoPlaySkipBack className="text-3xl" />
                </button>
              </div>

              {/* Play/Pause Button */}
              <button className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-400 transition-colors">
                {isPlaying ? (
                  <IoPause className="text-2xl text-white" />
                ) : (
                  <IoPlay className="text-2xl text-white ml-1" />
                )}
              </button>

              <div className="flex items-center space-x-6">
                <button className="p-3 hover:bg-gray-800 rounded-full transition-colors">
                  <IoPlaySkipForward className="text-3xl" />
                </button>
                <button className="p-3 hover:bg-gray-800 rounded-full transition-colors">
                  <IoRepeat className="text-2xl text-gray-400" />
                </button>
              </div>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                  {isLiked ? (
                    <IoHeart className="text-2xl text-green-500" />
                  ) : (
                    <IoHeartOutline className="text-2xl text-gray-400" />
                  )}
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                  <IoShareSocial className="text-2xl text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                  <IoList className="text-2xl text-gray-400" />
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-3">
                <IoVolumeHigh className="text-xl text-gray-400" />
                <div className="w-24 h-1 bg-gray-700 rounded-lg relative">
                  <div 
                    className="h-1 bg-white rounded-lg absolute top-0 left-0"
                    style={{ width: `${volume}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Up Next Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold mb-6">Up Next</h3>
          <div className="space-y-4">
            {/* Next Track 1 */}
            <div className="flex items-center space-x-4 p-3 hover:bg-gray-800 rounded-lg transition-colors">
              <img 
                src="https://images.unsplash.com/photo-1571974599782-87624638275f?w=100&h=100&fit=crop"
                alt="Next track"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">Levitating</p>
                <p className="text-sm text-gray-400">Dua Lipa</p>
              </div>
              <span className="text-gray-400 text-sm">3:23</span>
            </div>

            {/* Next Track 2 */}
            <div className="flex items-center space-x-4 p-3 hover:bg-gray-800 rounded-lg transition-colors">
              <img 
                src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=100&h=100&fit=crop"
                alt="Next track"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">Good Days</p>
                <p className="text-sm text-gray-400">SZA</p>
              </div>
              <span className="text-gray-400 text-sm">4:38</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MusicPlayer;