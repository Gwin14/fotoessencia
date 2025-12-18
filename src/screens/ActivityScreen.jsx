import "./ActivityScreen.css";

import { useYoutube } from "../context/YoutubeContext";
import Carousel from "../components/Carousel";
import BlurText from "../components/BlurText";

export default function ActivityScreen() {
  const { videos, loading } = useYoutube();

  if (loading) return <p>Carregando vídeos...</p>;

  return (
    <div className="activity-screen">
      <section className="activity-title">
        <div className="blur-text-div">
          <BlurText text="Atividade" />
          <br />
          <BlurText text="recente" />
        </div>

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
            baseWidth={600}
            autoplay={true}
            autoplayDelay={5000}
            pauseOnHover={true}
            loop={true}
            round={false}
            isYoutube={true}
          />
        </div>
      </section>
    </div>
  );
}
