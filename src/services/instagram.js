// services.js

const INSTAGRAM_MEDIA_URL =
  "https://graph.facebook.com/v22.0/17841468246347845/media";
const ACCESS_TOKEN =
  "EAAI5ehjnV5wBPM5Ps6vyOZBDHRH4h2J320wp6yKI9DNlCeZAhx7Y1O5gCWY69ZC4wwOO9RYoZCK20hFjGQiyZBHFbxln5FVLeK91LoGT5FnCWpBmFry8zUKx9g0wZAYj7dU5ODn9jbDTegrwcXyoZCDbFhyZAOOIz6TVCs61X9YNZCl6Uf6jYjEwxfqL5C1WsHw0FsZADYpKjLgbGcLDKBpW2LKosAYQR333EhSAZDZD";

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
