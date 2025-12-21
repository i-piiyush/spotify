import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMusic } from "../hooks/useMusic";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaHeart,
  FaRegHeart,
  FaEllipsisH,
  FaRandom,
  FaRedo,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { musicApi } from "../api/musicApi";
const Player = () => {
  const { id } = useParams();
  const { music } = useMusic();
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  /* ---------------- MUSIC MAP ---------------- */
  const musicMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(music)) {
      for (const t of music) {
        map.set(String(t._id), t);
      }
    }
    return map;
  }, [music]);

  /* ----------- SET CURRENT MUSIC ----------- */
  useEffect(() => {
    if (!id || musicMap.size === 0) return;

    const track = musicMap.get(String(id));
    if (!track) return;

    setCurrentMusic(track);
    setIsLiked(track.isLiked ?? false);
    setLikes(track.likedBy?.length ?? 0);
    setCurrentTime(0);
    setDuration(0);
  }, [id, musicMap]);

  /* ----------- LOAD AUDIO ----------- */
  useEffect(() => {
    if (!currentMusic || !audioRef.current) return;

    const audio = audioRef.current;
    audio.src = currentMusic.musicUrl;
    audio.load();

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [currentMusic]);

  /* ----------- METADATA (DURATION) ----------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => audio.removeEventListener("loadedmetadata", onLoadedMetadata);
  }, [currentMusic]);

  /* ----------- TIME SYNC (THE FIX) ----------- */
useEffect(() => {
  const audio = audioRef.current;
  if (!audio || !currentMusic) return;

  const onTimeUpdate = () => {
    setCurrentTime(audio.currentTime);
  };

  const onEnded = () => {
    setIsPlaying(false);
  };

  audio.addEventListener("timeupdate", onTimeUpdate);
  audio.addEventListener("ended", onEnded);

  return () => {
    audio.removeEventListener("timeupdate", onTimeUpdate);
    audio.removeEventListener("ended", onEnded);
  };
}, [currentMusic])
  /* ----------- VOLUME ----------- */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  /* ----------- CONTROLS ----------- */
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };
  const handleLikes = async () => {
    try {
      setIsLiked((prev) => {
        setLikes((l) => (prev ? l - 1 : l + 1));
        return !prev;
      });
      await musicApi.likeMusic(id);
    } catch (err) {
      setIsLiked((prev) => {
        setLikes((l) => (prev ? l - 1 : l + 1));
        return !prev;
      });
      console.error(err);
    }
  };

  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  if (!currentMusic) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        No track selected
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <audio ref={audioRef} />

      <div className="w-full max-w-md">
        {/* Album Art */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-emerald-500 rounded-3xl blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
          <div className="relative bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] border border-emerald-500/20">
            <img
              src={currentMusic.coverArtUrl}
              alt={currentMusic.title}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Track Info */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2 truncate">
            {currentMusic.title}
          </h1>
          <p className="text-lg text-gray-300 truncate">
            {currentMusic.artist}
          </p>
          <span className="inline-block mt-2 px-3 py-1 bg-emerald-500/20 rounded-full text-xs font-medium text-emerald-400 capitalize border border-emerald-500/30">
            {currentMusic.genre}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="h-1 bg-zinc-800 rounded-full cursor-pointer relative group"
          >
            <div
              className="absolute h-full bg-emerald-500 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              isShuffle ? "text-emerald-400" : "text-gray-400 hover:text-white"
            }`}
          >
            <FaRandom size={20} />
          </button>

          <button className="p-3 rounded-full text-gray-300 hover:bg-zinc-800 transition-all duration-300 hover:scale-110 active:scale-95">
            <FaStepBackward size={20} />
          </button>

          <button
            onClick={togglePlay}
            className="p-5 rounded-full bg-emerald-500 text-black shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/60 hover:bg-emerald-400 transform transition-all duration-300 hover:scale-110 active:scale-95"
          >
            {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
          </button>

          <button className="p-3 rounded-full text-gray-300 hover:bg-zinc-800 transition-all duration-300 hover:scale-110 active:scale-95">
            <FaStepForward size={20} />
          </button>

          <button
            onClick={() => setRepeatMode((repeatMode + 1) % 3)}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 relative ${
              repeatMode > 0
                ? "text-emerald-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FaRedo size={20} />
            {repeatMode === 2 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full text-[8px] text-black flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between px-4 py-4 bg-zinc-900 rounded-2xl border border-emerald-500/20">
          <button
            onClick={() => {
              handleLikes();
            }}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
              isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
          >
            {isLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors relative"
            >
              {isMuted || volume === 0 ? (
                <FaVolumeMute size={20} />
              ) : (
                <FaVolumeUp size={20} />
              )}

              {showVolumeSlider && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-zinc-900 rounded-full p-2 shadow-lg border border-emerald-500/20">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 accent-emerald-500 cursor-pointer"
                  />
                </div>
              )}
            </button>
          </div>

          <button className="p-2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95">
            <FaEllipsisH size={20} />
          </button>
        </div>

        {/* Liked By Count */}
        {likes > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            {likes} {likes === 1 ? "like" : "likes"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;
