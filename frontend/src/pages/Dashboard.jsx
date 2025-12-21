import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
import { musicApi } from "../api/musicApi";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser";

const Dashboard = () => {
  const {user} = useUser()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
   
  } = useForm();
  const [coverPreview, setCoverPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const coverInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const genres = [
    {
      value: "pop",
      label: "Pop",
      emoji: "🎵",
      color: "from-pink-500 to-pink-600",
    },
    {
      value: "rock",
      label: "Rock",
      emoji: "🎸",
      color: "from-red-500 to-red-600",
    },
    {
      value: "hiphop",
      label: "Hip Hop",
      emoji: "🎤",
      color: "from-purple-500 to-purple-600",
    },
    {
      value: "electronic",
      label: "Electronic",
      emoji: "⚡",
      color: "from-blue-500 to-blue-600",
    },
    {
      value: "jazz",
      label: "Jazz",
      emoji: "🎷",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      value: "classical",
      label: "Classical",
      emoji: "🎻",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      value: "r&b",
      label: "R&B",
      emoji: "🎹",
      color: "from-teal-500 to-teal-600",
    },
    {
      value: "country",
      label: "Country",
      emoji: "🤠",
      color: "from-orange-500 to-orange-600",
    },
    {
      value: "lofi",
      label: "Lofi",
      emoji: "☕",
      color: "from-amber-700 to-amber-800",
    },
    {
      value: "metal",
      label: "Metal",
      emoji: "🔥",
      color: "from-gray-600 to-gray-700",
    },
    {
      value: "reggae",
      label: "Reggae",
      emoji: "🌴",
      color: "from-green-500 to-green-600",
    },
    {
      value: "blues",
      label: "Blues",
      emoji: "💙",
      color: "from-blue-600 to-blue-700",
    },
  ];

  const handleCoverArtChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("coverArt", file);
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
    }
  };

  const handleAudioFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "audio/mpeg" || file.type === "audio/wav")) {
      setValue("audio", file);
    } else {
      alert("Please upload a valid MP3 or WAV file");
    }
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre.value);
    setValue("genre", genre.value);
  };

  const onSubmit = async (data) => {

    const formData = new FormData()
    formData.append("title",data.title)
    formData.append("genre",data.genre)
    formData.append("audio",data.audio)
    formData.append("coverArt",data.coverArt)

    
    
    try {
      setIsUploading(true);
      const res = await musicApi.uploadMusic(formData);
     
      
      toast.success(res.data.message)
    } catch (error) {
      console.log(error);
      
      toast.error(error.response.data.message)
    }
    finally{
      setIsUploading(false)
    }
  };

  const triggerCoverInput = () => {
    coverInputRef.current?.click();
  };

  const triggerAudioInput = () => {
    audioInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar user={{ role: user.role }} />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Upload Your Music
          </h1>
          <p className="text-gray-400">Share your creativity with the world</p>
        </div>

        {/* Upload Form */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Song Title *
              </label>
              <input
                type="text"
                {...register("title", { required: "Song title is required" })}
                placeholder="Enter song title"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Sleek Genre Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Genre *
              </label>

              {/* Selected Genre Badge */}
              {selectedGenre && (
                <div className="mb-4 p-4 bg-gray-700/50 rounded-xl border border-green-500/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${
                          genres.find((g) => g.value === selectedGenre)?.color
                        } rounded-xl flex items-center justify-center text-white text-lg shadow-lg`}
                      >
                        {genres.find((g) => g.value === selectedGenre)?.emoji}
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Selected Genre</p>
                        <p className="text-white font-semibold">
                          {genres.find((g) => g.value === selectedGenre)?.label}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGenre("");
                        setValue("genre", "");
                      }}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Genre Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {genres.map((genre) => (
                  <button
                    key={genre.value}
                    type="button"
                    onClick={() => handleGenreSelect(genre)}
                    className={`group relative p-4 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                      selectedGenre === genre.value
                        ? `border-green-500 bg-gradient-to-br ${genre.color} shadow-lg scale-105`
                        : "border-gray-600 bg-gray-700/50 hover:border-green-400 hover:bg-gray-600/50 hover:scale-105"
                    }`}
                  >
                    {/* Background Glow Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        genre.color
                      } opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                        selectedGenre === genre.value ? "opacity-20" : ""
                      }`}
                    ></div>

                    <div className="relative z-10 flex flex-col items-center space-y-2">
                      <div
                        className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${
                          selectedGenre === genre.value ? "scale-110" : ""
                        }`}
                      >
                        {genre.emoji}
                      </div>
                      <span
                        className={`text-sm font-medium transition-colors ${
                          selectedGenre === genre.value
                            ? "text-white"
                            : "text-gray-300 group-hover:text-white"
                        }`}
                      >
                        {genre.label}
                      </span>
                    </div>

                    {/* Selection Checkmark */}
                    {selectedGenre === genre.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <input
                type="hidden"
                {...register("genre", { required: "Please select a genre" })}
              />
              {errors.genre && (
                <p className="text-red-400 text-sm mt-3 text-center">
                  {errors.genre.message}
                </p>
              )}
            </div>

            {/* Cover Art Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cover Art
              </label>
              <div
                onClick={triggerCoverInput}
                className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center cursor-pointer hover:border-green-500 transition-all group bg-gray-700/30"
              >
                <input
                  type="file"
                  ref={coverInputRef}
                  onChange={handleCoverArtChange}
                  accept="image/*"
                  className="hidden"
                />
                {coverPreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-32 h-32 rounded-xl object-cover mb-4 shadow-lg ring-2 ring-green-500/30"
                    />
                    <p className="text-green-400 text-sm">Cover art selected</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverPreview(null);
                        setValue("coverArt", null);
                      }}
                      className="text-red-400 text-sm mt-1 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-600 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-green-500/20 transition-all group-hover:scale-110">
                      <svg
                        className="w-8 h-8 text-gray-400 group-hover:text-green-400 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 group-hover:text-green-400 transition-colors">
                      Click to upload cover art
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      PNG, JPG, JPEG (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Audio File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Audio File *
              </label>
              <div
                onClick={triggerAudioInput}
                className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center cursor-pointer hover:border-green-500 transition-all group bg-gray-700/30"
              >
                <input
                  type="file"
                  ref={audioInputRef}
                  onChange={handleAudioFileChange}
                  accept=".mp3,.wav,audio/mpeg,audio/wav"
                  className="hidden"
                />
                {watch("audio") ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-3 ring-2 ring-green-500/30">
                      <svg
                        className="w-8 h-8 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-green-400 text-sm mb-1">
                      Audio file selected
                    </p>
                    <p className="text-gray-400 text-xs">
                      {watch("audio").name}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("audio", null);
                      }}
                      className="text-red-400 text-sm mt-1 hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-600 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-green-500/20 transition-all group-hover:scale-110">
                      <svg
                        className="w-8 h-8 text-gray-400 group-hover:text-green-400 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 group-hover:text-green-400 transition-colors">
                      Click to upload audio file
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      MP3 or WAV (Max 50MB)
                    </p>
                  </div>
                )}
              </div>
              {errors.audio && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.audio.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold shadow-lg hover:from-green-600 hover:to-green-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Upload Music</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
