import { useContext } from "react";
import { MusicContext } from "../context/MusicProvider";

export const useMusic = () => useContext(MusicContext)