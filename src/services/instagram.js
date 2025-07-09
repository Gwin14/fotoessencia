const INSTAGRAM_MEDIA_URL =
  "https://graph.facebook.com/v22.0/17841468246347845/media";
const INSTAGRAM_PROFILE_URL =
  "https://graph.facebook.com/v22.0/17841468246347845";

const ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;

// Busca imagens do Instagram
export async function fetchInstagramImages() {
  const url = `${INSTAGRAM_MEDIA_URL}?fields=id,caption,media_url,timestamp,media_type&access_token=${ACCESS_TOKEN}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao buscar imagens do Instagram");
    const data = await response.json();

    // filtra apenas imagens (media_type === "IMAGE")
    const images = data.data.filter((item) => item.media_type === "IMAGE");

    // retorna array com URLs das imagens
    return images.map((img) => img.media_url);
  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
    return []; // retorna array vazio em caso de erro
  }
}

// Busca informações do perfil do Instagram
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
