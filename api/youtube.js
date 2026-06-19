const CHANNEL_ID = "UCI37VLKmlUkfXu_VWx0JJFw";

const CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels";
const PLAYLIST_ITEMS_URL =
  "https://www.googleapis.com/youtube/v3/playlistItems";

export default async function handler(req, res) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  try {
    const channelRes = await fetch(
      `${CHANNELS_URL}?part=contentDetails&id=${CHANNEL_ID}&key=${apiKey}`,
    );
    if (!channelRes.ok) throw new Error("Erro ao buscar canal");

    const channelData = await channelRes.json();
    const uploadsPlaylistId =
      channelData.items[0].contentDetails.relatedPlaylists.uploads;

    let videos = [];
    let nextPageToken = "";

    do {
      const playlistRes = await fetch(
        `${PLAYLIST_ITEMS_URL}?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`,
      );
      if (!playlistRes.ok) throw new Error("Erro ao buscar vídeos");

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

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
