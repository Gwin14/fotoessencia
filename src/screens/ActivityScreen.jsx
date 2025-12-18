import { useYoutube } from "../context/YoutubeContext";

export default function ActivityScreen() {
  const { videos, loading } = useYoutube();

  if (loading) return <p>Carregando vídeos...</p>;

  return (
    <div>
      {videos.map((video) => (
        <div key={video.id}>
          <h3>{video.title}</h3>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${video.id}`}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      ))}
    </div>
  );
}
