import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { musicApi } from "../api/musicApi";
import toast from "react-hot-toast";
import { useMusic } from "../context/MusicContext";

const Player = () => {
  const { id } = useParams();
  const { music } = useMusic(); // music might be [] or undefined depending on your context
  const [currentMusic, setCurrentMusic] = useState(null);
  const [loading, setLoading] = useState(false);

  // Build map at top-level (hooks must be top-level)
  const musicMap = useMemo(() => {
    const m = new Map();
    if (Array.isArray(music)) {
      for (const t of music) {
        if (t && t._id != null) m.set(String(t._id), t);
      }
    }
    return m;
  }, [music]);

  useEffect(() => {
    console.log("Player mount/effect -> id:", id);
    console.log("music (from context) -> type:", typeof music, "isArray:", Array.isArray(music), "length:", Array.isArray(music) ? music.length : null);

    if (!id) {
      console.warn("Player: no id param present");
      setCurrentMusic(null);
      return;
    }

    // 1) Local O(1) lookup via Map
    const local = musicMap.get(String(id));
    if (local) {
      console.log("Player: found track in musicMap (O(1)):", local);
      setCurrentMusic(local);
      return; // done
    }

    // 2) fallback: safe linear search on music array (one-time)
    if (Array.isArray(music) && music.length > 0) {
      const found = music.find((t) => String(t._id) === String(id));
      if (found) {
        console.log("Player: found track via .find() fallback:", found);
        setCurrentMusic(found);
        return;
      }
    }

    // 3) final fallback: fetch single track from API
    let mounted = true;
    (async () => {
      try {
        console.log("Player: track not found locally — calling API for id:", id);
        setLoading(true);
        const res = await musicApi.getMusicById(id); // ensure this endpoint exists
        console.log("Player: API response:", res?.data);
        const track = res?.data?.music ?? res?.data ?? null;

        if (!mounted) return;
        if (track) {
          console.log("Player: caching fetched track and setting currentMusic:", track);
          setCurrentMusic(track);
          // Optionally: update context cache if you expose setMusic in context
          // setMusic(prev => Array.isArray(prev) ? [...prev, track] : [track])
        } else {
          console.warn("Player: API returned no track for id:", id);
          setCurrentMusic(null);
          toast.error("Track not found");
        }
      } catch (err) {
        console.error("Player: error fetching track by id:", err);
        if (mounted) {
          setCurrentMusic(null);
          toast.error("Failed to fetch track");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, musicMap, music]);

  return (
    <div>
    
    </div>
  );
};

export default Player;
