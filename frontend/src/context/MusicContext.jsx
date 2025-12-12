import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { musicApi } from "../api/musicApi";
import toast from "react-hot-toast";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await musicApi.getMusic();
        const list = Array.isArray(res?.data?.music)
          ? res.data.music
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setMusic(list);
        setLoading(false);
        toast.success(res.data.message);
      } catch (error) {
        console.log("error while fetching music: ", error.response);
        setMusic(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);


  return (
    <MusicContext.Provider value={{ music, loading, isLiked, setIsLiked }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
