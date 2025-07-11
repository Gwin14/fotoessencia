import React, { useEffect, useState } from "react";
import ImageTrail from "../components/ImageTrail";
import TrueFocus from "../components/TrueFocus";
import TiltedCard from "../components/TiltedCard";
import ScrambledText from "../components/ScrambledText";
import CurvedLoop from "../components/CurvedLoop";
import ChromaGrid from "../components/ChromaGrid";
import CircularGallery from "../components/CircularGallery";
import CountUp from "../components/CountUp";
import GradientText from "../components/GradientText";

import { items } from "../data/photoLocations"; // importa os itens do ChromaGrid

import { fetchInstagramImages } from "../services/instagram"; // importa a função
import { fetchInstagramProfileInfo } from "../services/instagram"; // importa a função

import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";
import { SiThreads } from "react-icons/si"; // Threads está no pacote de ícones "simple-icons"

import "./MainScreen.css"; // importa o CSS específico para este componente

export default function MainScreen() {
  const [images, setImages] = useState([]);
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      const imgs = await fetchInstagramImages();
      setImages(imgs);
    };

    const loadProfleInfo = async () => {
      const profile = await fetchInstagramProfileInfo();
      setProfileInfo(profile);
    };

    loadImages();
    loadProfleInfo();
  }, []);

  return (
    <>
      <div
        className="image-trail-content"
        style={{ height: "40dvh", position: "relative", overflow: "hidden" }}
      >
        <ImageTrail
          items={
            images.length
              ? images
              : [
                  "https://picsum.photos/id/287/300/300",
                  "https://picsum.photos/id/1001/300/300",
                ]
          }
          variant={1}
          backgroundImage="https://scontent-sea5-1.cdninstagram.com/v/t39.30808-6/492329036_122156301518506495_770398862162671498_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&ccb=1-7&_nc_sid=18de74&_nc_ohc=u-bZkDjTcZsQ7kNvwEXsvw9&_nc_oc=AdkYwvV1WUvBlOUJ9vpTqaFMpposIdRDHhwf6xp6jzzC17jFTAi--Qt-fYFjunq-Opo&_nc_zt=23&_nc_ht=scontent-sea5-1.cdninstagram.com&edm=AM6HXa8EAAAA&_nc_gid=SAba6EYM9F4uqht0Y8O04g&oh=00_AfSkseuZ3r-aHy-zpCAYP2nlSeGkl-MqYjAw6C6svJbN8A&oe=68730F3A"
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
        speed={3}
        curveAmount={300}
        direction="right"
        interactive={true}
        className="custom-text-style"
      />
      <h2 className="topic-title">Vários locais</h2>
      <div style={{ position: "relative" }}>
        <ChromaGrid
          items={items}
          radius={300}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </div>

      <h2 className="topic-title" style={{ marginTop: 200, marginBottom: -30 }}>
        Fotos, Vídeos,
      </h2>
      <h2 className="topic-title">Histórias, Momentos</h2>

      <div style={{ height: "600px", position: "relative" }}>
        <CircularGallery
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.02}
        />
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
    </>
  );
}
