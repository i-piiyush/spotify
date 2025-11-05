import { createContext, useContext, useEffect, useState } from "react";
import { musicApi } from "../api/musicApi";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await musicApi.getMusic();
        console.log(res.data.message, res.data.music);
        setMusic(res.data.music);
        setLoading(false);
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
    <MusicContext.Provider value={{ music, loading }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
