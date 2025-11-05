import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchInstagramImages,
  fetchInstagramMedia,
  fetchInstagramProfileInfo,
} from "../services/instagram";

const InstagramContext = createContext();

export function InstagramProvider({ children }) {
  const [images, setImages] = useState([]);
  const [profileInfo, setProfileInfo] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInstagramData = async () => {
      try {
        const [imgs, profile, med] = await Promise.all([
          fetchInstagramImages(),
          fetchInstagramProfileInfo(),
          fetchInstagramMedia(),
        ]);
        setImages(imgs);
        setProfileInfo(profile);
        setMedia(med);
      } catch (error) {
        console.error("Erro ao carregar dados do Instagram:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInstagramData();
  }, []);

  return (
    <InstagramContext.Provider
      value={{ images, profileInfo, media, loading }}
    >
      {children}
    </InstagramContext.Provider>
  );
}

// Hook customizado para facilitar o uso
export function useInstagram() {
  return useContext(InstagramContext);
}
