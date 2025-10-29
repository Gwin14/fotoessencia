const INSTAGRAM_MEDIA_URL =
  "https://graph.facebook.com/v22.0/17841468246347845/media";
const INSTAGRAM_PROFILE_URL =
  "https://graph.facebook.com/v22.0/17841468246347845";

const ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;

// Cache para evitar requisições duplicadas
const cache = {
  images: null,
  media: null,
  profile: null,
  timestamp: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Busca todas as imagens (sem limite)
export async function fetchInstagramImages() {
  if (cache.images && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.images;
  }

  try {
    const allMedia = await fetchAllInstagramMedia();
    const images = allMedia
      .filter((item) => item.media_type === "IMAGE")
      .map((img) => img.media_url);

    cache.images = images;
    cache.timestamp = Date.now();

    return images;
  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
    return [];
  }
}

// Busca informações do perfil com cache
export async function fetchInstagramProfileInfo() {
  if (cache.profile && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.profile;
  }

  const fields = "profile_picture_url,biography,followers_count,media_count";
  const url = `${INSTAGRAM_PROFILE_URL}?fields=${fields}&access_token=${ACCESS_TOKEN}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao buscar informações do perfil");
    const data = await response.json();

    const profileData = {
      profilePicture: data.profile_picture_url,
      bio: data.biography,
      followers: data.followers_count,
      mediaCount: data.media_count,
    };

    cache.profile = profileData;
    return profileData;
  } catch (error) {
    console.error("Erro ao buscar informações do perfil:", error);
    return null;
  }
}

// Função para buscar TODA a mídia sem paginação
export async function fetchInstagramMedia() {
  if (cache.media && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.media;
  }

  try {
    const allMedia = await fetchAllInstagramMedia();
    cache.media = allMedia;
    cache.timestamp = Date.now();
    return allMedia;
  } catch (error) {
    console.error("Erro ao buscar mídia:", error);
    return [];
  }
}

// Função auxiliar para percorrer todas as páginas da API
async function fetchAllInstagramMedia() {
  let allItems = [];
  let nextUrl = `${INSTAGRAM_MEDIA_URL}?fields=id,caption,media_url,media_type,thumbnail_url&access_token=${ACCESS_TOKEN}&limit=100`;

  while (nextUrl) {
    const response = await fetch(nextUrl);
    if (!response.ok) throw new Error("Erro ao buscar mídia do Instagram");

    const data = await response.json();
    const items = data.data.map((item) => ({
      id: item.id,
      caption: item.caption,
      media_type: item.media_type,
      display_url: item.thumbnail_url || item.media_url,
      media_url: item.media_url,
    }));

    allItems.push(...items);
    nextUrl = data.paging?.next || null;
  }

  return allItems;
}
