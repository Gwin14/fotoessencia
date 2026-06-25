const INSTAGRAM_MEDIA_URL =
  "https://graph.facebook.com/v22.0/17841468246347845/media";
const INSTAGRAM_PROFILE_URL =
  "https://graph.facebook.com/v22.0/17841468246347845";

// Gera uma URL apontando para o proxy de imagem (/api/img-proxy), que
// redimensiona e converte para WebP antes de chegar ao navegador.
function proxied(url, width, quality = 75) {
  if (!url) return null;
  return `/api/img-proxy?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
}

async function fetchAllInstagramMedia(accessToken) {
  let allItems = [];
  let nextUrl = `${INSTAGRAM_MEDIA_URL}?fields=id,caption,media_url,media_type,thumbnail_url&access_token=${accessToken}&limit=100`;

  while (nextUrl) {
    const response = await fetch(nextUrl);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        `Erro ao buscar mídia do Instagram: ${data.error?.message || response.status}`,
      );
    }

    const items = data.data.map((item) => ({
      id: item.id,
      caption: item.caption,
      media_type: item.media_type,
      is_video: item.media_type === "VIDEO",
      // tamanho pequeno (grid, trail)
      thumb: proxied(item.thumbnail_url || item.media_url, 400),
      // tamanho médio (modal / visualização ampliada)
      full: proxied(item.media_url, 1200, 80),
      display_url: proxied(item.thumbnail_url || item.media_url, 400),
      // mantém a URL original só para vídeo (não dá pra processar com sharp)
      media_url: item.media_url,
      // poster do vídeo já otimizado (quando o Instagram fornece thumbnail)
      thumbnail_url: item.thumbnail_url
        ? proxied(item.thumbnail_url, 400)
        : null,
    }));

    allItems.push(...items);
    nextUrl = data.paging?.next ?? null;
  }

  return allItems;
}

export default async function handler(req, res) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  try {
    const [allMedia, profileResponse] = await Promise.all([
      fetchAllInstagramMedia(accessToken),
      fetch(
        `${INSTAGRAM_PROFILE_URL}?fields=profile_picture_url,biography,followers_count,media_count&access_token=${accessToken}`,
      ),
    ]);

    const profileRaw = await profileResponse.json();
    if (!profileResponse.ok) {
      throw new Error(
        `Erro ao buscar perfil do Instagram: ${profileRaw.error?.message || profileResponse.status}`,
      );
    }

    const result = {
      media: allMedia,
      // trail usa miniaturas leves (400px) em vez do media_url cheio
      images: allMedia.map((i) => i.thumb).filter(Boolean),
      profileInfo: {
        profilePicture: proxied(profileRaw.profile_picture_url, 300),
        bio: profileRaw.biography,
        followers: profileRaw.followers_count,
        mediaCount: profileRaw.media_count,
      },
    };

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
