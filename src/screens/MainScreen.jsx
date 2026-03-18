import React, { useEffect, useState, useMemo, Suspense } from "react";
import ImageTrail from "../components/ImageTrail";
import TrueFocus from "../components/TrueFocus";
import TiltedCard from "../components/TiltedCard";
import ScrambledText from "../components/ScrambledText";
import CurvedLoop from "../components/CurvedLoop";
import CountUp from "../components/CountUp";
import GradientText from "../components/GradientText";
import { useInstagram } from "../context/InstagramContext";

import { items } from "../data/photoLocations";

import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

import "./MainScreen.css";
import barcoCapa from "../assets/image/barcoCapa.jpg";

// Lazy load dos componentes pesados
const ChromaGrid = React.lazy(() => import("../components/ChromaGrid"));
const CircularGallery = React.lazy(
  () => import("../components/CircularGallery"),
);

export default function MainScreen() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const { images, profileInfo, media } = useInstagram();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);

    const loadData = async () => {};

    loadData();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoriza items para evitar re-render
  const memoItems = useMemo(() => items, []);

  // Placeholder de fallback
  const fallbackImages = [
    "https://picsum.photos/id/287/300/300",
    "https://picsum.photos/id/1001/300/300",
  ];

  return (
    <>
      <div
        className="image-trail-content"
        style={{ height: "40dvh", position: "relative", overflow: "hidden" }}
      >
        <ImageTrail
          items={images.length ? images : fallbackImages}
          variant={1}
          backgroundImage={barcoCapa}
        />
      </div>

      <TrueFocus
        sentence="Foto Essência"
        manualMode={false}
        blurAmount={8}
        borderColor="#D7A339"
        animationDuration={1}
        pauseBetweenAnimations={1.5}
      />

      <section className="about">
        <TiltedCard
          imageSrc={profileInfo?.profilePicture}
          altText="Foto Essência"
          captionText="Foto Essência - Instagram"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={12}
          scaleOnHover={1.2}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={true}
          overlayContent={
            <p className="tilted-card-demo-text">Foto Essência - Instagram</p>
          }
        />

        <div className="bio">
          {profileInfo?.bio && (
            <ScrambledText
              className="scrambled-text-demo"
              radius={100}
              duration={1.2}
              speed={0.5}
              scrambleChars="🌻"
            >
              {profileInfo.bio}
            </ScrambledText>
          )}
          <div
            className="social-icons"
            style={{ display: "flex", gap: "1rem" }}
          >
            <a
              href="https://www.instagram.com/fotoessencia_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={24} color="#E4405F" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61565194861450/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={24} color="#1877F2" />
            </a>
            <a
              href="https://www.threads.net/@fotoessencia_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiThreads size={24} color="#000" />
            </a>
            <a href="mailto:fotoessencia10@gmail.com">
              <FaEnvelope size={24} color="#FF405F" />
            </a>
          </div>
        </div>
      </section>

      <CurvedLoop
        marqueeText="praias ✦ animais ✦ cidades ✦ momentos ✦ "
        speed={2} // leve redução de velocidade
        curveAmount={300}
        direction="right"
        interactive={true}
        className="custom-text-style"
      />

      <h2 className="topic-title">Vários locais</h2>
      <div style={{ position: "relative" }}>
        <Suspense fallback={<div>Carregando grid...</div>}>
          <ChromaGrid
            items={memoItems}
            radius={300}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
          />
        </Suspense>
      </div>

      <h2 className="topic-title" style={{ marginTop: 200, marginBottom: -30 }}>
        Fotos, Vídeos,
      </h2>
      <h2 className="topic-title">Histórias, Momentos</h2>

      <div style={{ height: "600px", position: "relative" }}>
        <Suspense fallback={<div>Carregando galeria...</div>}>
          <CircularGallery
            bend={isMobile ? 0 : 3}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollEase={0.02}
          />
        </Suspense>
      </div>

      <h2 className="topic-title" style={{ marginTop: 200, marginBottom: -30 }}>
        Cada dia
      </h2>
      <h2 className="topic-title" style={{ marginBottom: 100 }}>
        crescendo mais
      </h2>

      <section className="count-up-container">
        <div className="count-group">
          <h3 className="count-title">Seguidores</h3>
          <GradientText
            colors={["#FFD700", "#FFC600", "#FFB900", "#FFAA00", "#FF9E00"]}
            animationSpeed={3}
            showBorder={false}
            className="custom-class"
          >
            <CountUp
              from={0}
              to={profileInfo?.followers || 0}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
            />
          </GradientText>
        </div>

        <div className="count-group">
          <h3 className="count-title">Mídia total</h3>
          <GradientText
            colors={["#FFD700", "#FFC600", "#FFB900", "#FFAA00", "#FF9E00"]}
            animationSpeed={3}
            showBorder={false}
            className="custom-class"
          >
            <CountUp
              from={0}
              to={profileInfo?.mediaCount || 0}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
            />
          </GradientText>
        </div>
      </section>

      <h2 className="topic-title" style={{ marginTop: 200, marginBottom: -30 }}>
        Conheça todo
      </h2>
      <h2 className="topic-title" style={{ marginBottom: 100 }}>
        o conteúdo
      </h2>

      <div>
        {media && media.length > 0 ? (
          <div className="gallery-grid">
            {media.map((item, idx) => (
              <div
                className="galery-item"
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                }}
              >
                {item.media_type === "VIDEO" ? (
                  <video
                    src={item.media_url}
                    controls
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <img
                    src={item.thumbnail_url || item.media_url}
                    alt={`Instagram ${idx}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhuma imagem carregada do Instagram.</p>
        )}
      </div>
    </>
  );
}
