import React, { useState } from "react";

// Componente de Galeria (Mantido)
function GalleryEmbed({ images, caption }) {
  const [current, setCurrent] = useState(0);
  if (!images || !images.length) return null;

  return (
    <div className="post-gallery">
      <div className="post-gallery-main">
        <img
          src={images[current].src}
          alt={caption || `Foto ${current + 1}`}
          loading="lazy"
        />
        {images.length > 1 && (
          <>
            <button
              className="post-gallery-btn post-gallery-prev"
              onClick={() =>
                setCurrent((c) => (c - 1 + images.length) % images.length)
              }
            >
              ‹
            </button>
            <button
              className="post-gallery-btn post-gallery-next"
              onClick={() => setCurrent((c) => (c + 1) % images.length)}
            >
              ›
            </button>
            <div className="post-gallery-counter">
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="post-gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`post-gallery-thumb${i === current ? " active" : ""}`}
              onClick={() => setCurrent(i)}
            >
              <img src={img.src} alt={`Miniatura ${i + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      )}
      {caption && <p className="post-gallery-caption">{caption}</p>}
    </div>
  );
}

// Componente de Vídeo (ATUALIZADO)
function VideoEmbed({ videoId }) {
  if (!videoId) return null;

  // URL direta para o arquivo de vídeo
  const videoUrl = `https://substack.com/api/v1/video/upload/${videoId}/src.mp4`;

  // URL da miniatura (poster) - Usando uma versão que costuma falhar menos
  const posterUrl = `https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F${videoId}_1920x1080.png`;

  return (
    <div
      className="post-video-container"
      style={{
        margin: "2rem 0",
        backgroundColor: "#000",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <p style={{ color: "#fffff6" }}>
        Vídeos ainda não estão disponíveis aqui, mas você ainda pode assistir no{" "}
        <a
          href="https://fotoessencia.substack.com"
          target="blank"
          style={{ color: "#ffaa00" }}
        >
          Substack
        </a>{" "}
        :)
      </p>
      <video
        controls
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        poster={posterUrl}
        style={{ width: "100%", display: "block" }}
      >
        <source src={videoUrl} type="video/mp4" />
        Seu navegador não suporta a reprodução de vídeos.
      </video>
    </div>
  );
}

export default function PostContent({ html }) {
  if (!html) return null;

  const parts = [];
  let lastIndex = 0;

  // Regex robusta para capturar embeds de Galeria e Vídeo
  const embedRegex =
    /<div[^>]*class=["']+(image-gallery-embed|native-video-embed)["']+.+?data-attrs=["']+(\{.*?\})["']+.+?<\/div>/g;

  let match;
  while ((match = embedRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "html", content: html.slice(lastIndex, match.index) });
    }

    try {
      const type = match[1];
      let attrsRaw = match[2]
        .replace(/&quot;/g, '"')
        .trim()
        .replace(/^'|'$/g, "");
      const data = JSON.parse(attrsRaw);

      if (type === "image-gallery-embed") {
        parts.push({
          type: "gallery",
          images: data?.gallery?.images || [],
          caption: data?.gallery?.caption || "",
        });
      } else if (type === "native-video-embed") {
        // O ID pode estar em mediaUploadId ou dentro de um objeto video
        parts.push({
          type: "video",
          videoId: data?.mediaUploadId || data?.video?.id,
          videoUrl: data?.video?.url || null,
        });
      }
    } catch (e) {
      console.error("Erro no parse do embed:", e);
      parts.push({ type: "html", content: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    parts.push({ type: "html", content: html.slice(lastIndex) });
  }

  return (
    <div className="post-content">
      {parts.map((part, i) => {
        if (part.type === "gallery") {
          return (
            <GalleryEmbed key={i} images={part.images} caption={part.caption} />
          );
        }
        if (part.type === "video") {
          return (
            <VideoEmbed
              key={i}
              videoId={part.videoId}
              videoUrl={part.videoUrl}
            />
          );
        }
        return (
          <div
            key={i}
            className="post-html-block"
            dangerouslySetInnerHTML={{ __html: part.content }}
          />
        );
      })}
    </div>
  );
}
