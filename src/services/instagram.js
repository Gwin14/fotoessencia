const INSTAGRAM_MEDIA_URL =
  "https://graph.facebook.com/v22.0/17841468246347845/media";
const INSTAGRAM_PROFILE_URL =
  "https://graph.facebook.com/v22.0/17841468246347845";

const ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;

const CACHE_KEY = "fotoessencia_ig_cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

// ─── Cache persistente no localStorage ────────────────────────────────────────

function saveCache(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  } catch (err) {
    // localStorage pode estar cheio ou bloqueado (modo privado em alguns browsers)
    console.warn("Não foi possível salvar cache:", err);
  }
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

// ─── Fetch único que traz tudo de uma vez ─────────────────────────────────────

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
      thumbnail_url: item.thumbnail_url ?? null,
    }));

    allItems.push(...items);
    nextUrl = data.paging?.next ?? null;
  }

  return allItems;
}

/**
 * Busca todos os dados do Instagram de uma única vez.
 * Usa cache do localStorage por 30 minutos.
 *
 * Retorna: { media, images, profileInfo }
 */
export async function fetchInstagramData() {
  // 1. Tenta retornar do cache
  const cached = loadCache();
  if (cached) return cached;

  // 2. Faz os dois fetches em paralelo (mídia + perfil)
  const [allMedia, profileResponse] = await Promise.all([
    fetchAllInstagramMedia(),
    fetch(
      `${INSTAGRAM_PROFILE_URL}?fields=profile_picture_url,biography,followers_count,media_count&access_token=${ACCESS_TOKEN}`,
    ),
  ]);

  if (!profileResponse.ok)
    throw new Error("Erro ao buscar perfil do Instagram");
  const profileRaw = await profileResponse.json();

  const result = {
    media: allMedia,
    images: allMedia
      // .filter((i) => i.media_type === "IMAGE")
      .map((i) => i.media_url),
    profileInfo: {
      profilePicture: profileRaw.profile_picture_url,
      bio: profileRaw.biography,
      followers: profileRaw.followers_count,
      mediaCount: profileRaw.media_count,
    },
  };

  // 3. Persiste no localStorage
  saveCache(result);

  return result;
}

// ─── Funções individuais mantidas por compatibilidade ─────────────────────────
// Todas chamam fetchInstagramData() internamente, sem fazer novo fetch.

export async function fetchInstagramImages() {
  const { images } = await fetchInstagramData();
  return images;
}

export async function fetchInstagramProfileInfo() {
  const { profileInfo } = await fetchInstagramData();
  return profileInfo;
}

export async function fetchInstagramMedia() {
  const { media } = await fetchInstagramData();
  return media;
}
