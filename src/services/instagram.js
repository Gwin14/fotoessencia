const INSTAGRAM_MEDIA_URL =
  "https://graph.facebook.com/v22.0/17841468246347845/media";
const INSTAGRAM_PROFILE_URL =
  "https://graph.facebook.com/v22.0/17841468246347845";

const ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;

// Busca imagens do Instagram com paginação
export async function fetchInstagramImages() {
  let allImages = [];
  let nextUrl = `${INSTAGRAM_MEDIA_URL}?fields=id,caption,media_url,timestamp,media_type,thumbnail_url&access_token=${ACCESS_TOKEN}&limit=100`;

  try {
    while (nextUrl) {
      const response = await fetch(nextUrl);
      if (!response.ok) throw new Error("Erro ao buscar imagens do Instagram");
      const data = await response.json();

      // Processa os dados recebidos
      const items = data.data.map((item) => {
        // Para vídeos, usa a thumbnail_url se disponível, caso contrário media_url
        if (
          item.media_type === "VIDEO" ||
          item.media_type === "CAROUSEL_ALBUM"
        ) {
          return {
            ...item,
            display_url: item.thumbnail_url || item.media_url,
          };
        }
        return item;
      });

      allImages = [...allImages, ...items];
      nextUrl = data.paging?.next || null;
    }

    // Filtra apenas imagens e retorna seus URLs
    return allImages
      .filter((item) => item.media_type === "IMAGE")
      .map((img) => img.media_url);
  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
    return []; // retorna array vazio em caso de erro
  }
}

// Busca informações do perfil do Instagram (mantido igual)
export async function fetchInstagramProfileInfo() {
  const fields = "profile_picture_url,biography,followers_count,media_count";
  const url = `${INSTAGRAM_PROFILE_URL}?fields=${fields}&access_token=${ACCESS_TOKEN}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao buscar informações do perfil");
    const data = await response.json();

    return {
      profilePicture: data.profile_picture_url,
      bio: data.biography,
      followers: data.followers_count,
      mediaCount: data.media_count,
    };
  } catch (error) {
    console.error("Erro ao buscar informações do perfil:", error);
    return null;
  }
}

// Busca imagens do Instagram com paginação
export async function fetchInstagramMedia() {
  let allItems = [];
  let nextUrl = `${INSTAGRAM_MEDIA_URL}?fields=id,caption,media_url,timestamp,media_type,thumbnail_url&access_token=${ACCESS_TOKEN}&limit=100`;

  try {
    while (nextUrl) {
      const response = await fetch(nextUrl);
      if (!response.ok) throw new Error("Erro ao buscar imagens do Instagram");
      const data = await response.json();

      const items = data.data.map((item) => {
        const display_url = item.thumbnail_url || item.media_url;
        return {
          id: item.id,
          caption: item.caption,
          media_type: item.media_type,
          display_url,
          media_url: item.media_url,
        };
      });

      allItems = [...allItems, ...items];
      nextUrl = data.paging?.next || null;
    }

    return allItems;
  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
    return [];
  }
}
