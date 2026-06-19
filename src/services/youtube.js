// Cache simples
const cache = {
  videos: null,
  timestamp: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Busca TODOS os vídeos do canal via Vercel Function (chave fica no servidor)
export async function fetchYoutubeVideos() {
  if (cache.videos && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.videos;
  }

  try {
    const response = await fetch("/api/youtube");
    if (!response.ok) throw new Error("Erro ao buscar vídeos");

    const videos = await response.json();

    cache.videos = videos;
    cache.timestamp = Date.now();

    return videos;
  } catch (error) {
    console.error("Erro ao buscar vídeos do YouTube:", error);
    return [];
  }
}
