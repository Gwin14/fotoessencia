import React, { useEffect, useState } from "react";
import ImageTrail from "../components/ImageTrail";
import TrueFocus from "../components/TrueFocus";
import TiltedCard from "../components/TiltedCard";

import { fetchInstagramImages } from "../services/instagram"; // importa a função
import { fetchInstagramProfileInfo } from "../services/instagram"; // importa a função

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
      </section>
    </>
  );
}
