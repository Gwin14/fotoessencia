import "./GaleryScreen.css";
import { useInstagram } from "../context/InstagramContext";
import { useState } from "react";
import SplitText from "../components/SplitText";
import { Helmet } from "react-helmet-async";

export default function GaleryScreen() {
  const { images, profileInfo, media } = useInstagram();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <div className="galery-screen">
      <Helmet>
        <title>Galeria | Foto Essência</title>
        <meta name="description" content="Conheça a minha galeria de fotos" />
      </Helmet>

      <SplitText
        tag="h1"
        text="A Galeria"
        className="text-2xl font-semibold text-center"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
        onLetterAnimationComplete={handleAnimationComplete}
      />

      <div>
        {media && media.length > 0 ? (
          <div className="gallery-grid">
            {media.map((item, idx) => (
              <div className="galery-item">
                {item.media_type === "VIDEO" ? (
                  <video
                    key={item.id}
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
                    key={item.id}
                    src={item.thumbnail_url || item.media_url}
                    alt={`Instagram ${idx}`}
                    loading="lazy"
                    onClick={() => setSelectedImage(item)}
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
        {/* Modal */}
        {selectedImage && (
          <div
            className="modal-background"
            onClick={() => setSelectedImage(null)} // fecha clicando fora
          >
            <div
              className="modal-container"
              onClick={(e) => e.stopPropagation()} // evita fechar clicando na imagem
            >
              {/* <span
                className="modal-close-btn"
                onClick={() => setSelectedImage(null)}
              >
                &times;
              </span> */}
              <img
                className="modal-image"
                src={selectedImage.media_url}
                alt={selectedImage.title}
              />
              <p className="modal-caption">{selectedImage.caption}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
