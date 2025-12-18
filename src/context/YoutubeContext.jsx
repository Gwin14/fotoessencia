import { createContext, useContext, useEffect, useState } from "react";
import { fetchYoutubeVideos } from "../services/youtube";

const YoutubeContext = createContext();

export function YoutubeProvider({ children }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadYoutubeData = async () => {
      try {
        const vids = await fetchYoutubeVideos();
        setVideos(vids);
      } catch (error) {
        console.error("Erro ao carregar dados do YouTube:", error);
      } finally {
        setLoading(false);
      }
    };

    loadYoutubeData();
  }, []);

  return (
    <YoutubeContext.Provider value={{ videos, loading }}>
      {children}
    </YoutubeContext.Provider>
  );
}

// Hook customizado
export function useYoutube() {
  return useContext(YoutubeContext);
}