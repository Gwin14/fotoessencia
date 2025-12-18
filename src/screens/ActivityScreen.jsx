import { useYoutube } from "../context/YoutubeContext";
import Carousel from "../components/Carousel";

export default function ActivityScreen() {
  const { videos, loading } = useYoutube();

  if (loading) return <p>Carregando vídeos...</p>;

  return (
    <div>
      <div
        style={{
          height: "600px",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Carousel
          items={videos}
          baseWidth={400}
          autoplay={true}
          autoplayDelay={5000}
          pauseOnHover={true}
          loop={true}
          round={false}
          isYoutube={true}
        />
      </div>
    </div>
  );
}
