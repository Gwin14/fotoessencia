const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = "UCI37VLKmlUkfXu_VWx0JJFw";

const CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels";
const PLAYLIST_ITEMS_URL =
  "https://www.googleapis.com/youtube/v3/playlistItems";

// Cache simples
const cache = {
  videos: null,
  timestamp: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Busca TODOS os vídeos do canal
export async function fetchYoutubeVideos() {
  if (cache.videos && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.videos;
  }

  try {
    // 1️⃣ Pega a playlist de uploads do canal
    const channelRes = await fetch(
      `${CHANNELS_URL}?part=contentDetails&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );

    if (!channelRes.ok) {
      throw new Error("Erro ao buscar canal");
    }

    const channelData = await channelRes.json();
    const uploadsPlaylistId =
      channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // 2️⃣ Busca todos os vídeos da playlist (com paginação)
    let videos = [];
    let nextPageToken = "";

    do {
      const playlistRes = await fetch(
        `${PLAYLIST_ITEMS_URL}?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken}&key=${YOUTUBE_API_KEY}`
      );

      if (!playlistRes.ok) {
        throw new Error("Erro ao buscar vídeos");
      }

      const playlistData = await playlistRes.json();

      const items = playlistData.items.map((item) => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.contentDetails.videoPublishedAt,
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.default?.url,
      }));

      videos.push(...items);
      nextPageToken = playlistData.nextPageToken || "";
    } while (nextPageToken);

    cache.videos = videos;
    cache.timestamp = Date.now();

    return videos;
  } catch (error) {
    console.error("Erro ao buscar vídeos do YouTube:", error);
    return [];
  }
}
