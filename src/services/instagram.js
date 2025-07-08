const INSTAGRAM_MEDIA_URL =
  "https://graph.facebook.com/v22.0/17841468246347845/media";
const ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;

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
