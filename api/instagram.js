const INSTAGRAM_MEDIA_URL =
  "https://graph.facebook.com/v22.0/17841468246347845/media";
const INSTAGRAM_PROFILE_URL =
  "https://graph.facebook.com/v22.0/17841468246347845";

async function fetchAllInstagramMedia(accessToken) {
  let allItems = [];
  let nextUrl = `${INSTAGRAM_MEDIA_URL}?fields=id,caption,media_url,media_type,thumbnail_url&access_token=${accessToken}&limit=100`;

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

export default async function handler(req, res) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  try {
    const [allMedia, profileResponse] = await Promise.all([
      fetchAllInstagramMedia(accessToken),
      fetch(
        `${INSTAGRAM_PROFILE_URL}?fields=profile_picture_url,biography,followers_count,media_count&access_token=${accessToken}`,
      ),
    ]);

    if (!profileResponse.ok)
      throw new Error("Erro ao buscar perfil do Instagram");
    const profileRaw = await profileResponse.json();

    const result = {
      media: allMedia,
      images: allMedia.map((i) => i.media_url),
      profileInfo: {
        profilePicture: profileRaw.profile_picture_url,
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
