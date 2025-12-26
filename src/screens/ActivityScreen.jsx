import "./ActivityScreen.css";

import { useYoutube } from "../context/YoutubeContext";
import { useInstagram } from "../context/InstagramContext";
import React from "react";
import Carousel from "../components/Carousel";
import BlurText from "../components/BlurText";
import SpotlightCard from "../components/SpotlightCard";

export default function ActivityScreen() {
  const { videos, loading } = useYoutube();
  const { images, loading: instagramLoading } = useInstagram();

  if (loading || instagramLoading) {
    return <p>Carregando atividades...</p>;
  }

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
            minHeight: "300px",
            maxHeight: "600px",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Carousel
            items={videos || []}
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

      <section
        className="activity-title instagram-section"
        style={{ marginTop: "200px" }}
      >
        <div
          style={{
            minHeight: "300px",
            maxHeight: "600px",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {images && images.length > 0 ? (
            <SpotlightCard
              className="custom-spotlight-card"
              spotlightColor="rgba(255, 255, 255, 0.52)"
            >
              <img
                src={images[0]}
                alt="Post do Instagram"
                style={{ maxWidth: "40vw", borderRadius: 12 }}
              />
            </SpotlightCard>
          ) : (
            <p>Nenhum post do Instagram encontrado.</p>
          )}
        </div>

        <div className="blur-text-div">
          <BlurText text="Último" />
          <br />
          <BlurText text="Post" />
        </div>
      </section>
    </div>
  );
}
