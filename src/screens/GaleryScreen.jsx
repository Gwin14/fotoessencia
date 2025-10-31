import "./GaleryScreen.css";
import { useInstagram } from "../context/InstagramContext";
import { useState } from "react";

export default function GaleryScreen() {
  const { images, profileInfo, media } = useInstagram();
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="galery-screen">
      <div>
        {media && media.length > 0 ? (
          <div
            style={{
              width: "80vw",
              margin: "auto",
              columnWidth: 300,
              columnGap: 16,
            }}
          >
            {media.map((item, idx) => (
              <div>
                {item.media_type === "VIDEO" ? (
                  <video
                    key={item.id}
                    src={item.media_url}
                    controls
                    loading="lazy"
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      marginBottom: 12,
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
                      objectFit: "cover",
                      borderRadius: 12,
                      marginBottom: 12,
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
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={() => setSelectedImage(null)} // fecha clicando fora
          >
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "8px",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()} // evita fechar clicando na imagem
            >
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  cursor: "pointer",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                onClick={() => setSelectedImage(null)}
              >
                &times;
              </span>
              <img
                src={selectedImage.media_url}
                alt={selectedImage.title}
                style={{ maxWidth: "500px", maxHeight: "80vh" }}
              />
              <p>{selectedImage.caption}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
