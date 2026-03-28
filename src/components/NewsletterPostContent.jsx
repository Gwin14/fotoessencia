import React, { useState } from "react";

function parseGalleryEmbed(node) {
  try {
    const raw = node.getAttribute("data-attrs");
    if (!raw) return null;
    const data = JSON.parse(raw);
    const images = data?.gallery?.images ?? [];
    const caption = data?.gallery?.caption ?? "";
    return { images, caption };
  } catch {
    return null;
  }
}

function GalleryEmbed({ images, caption }) {
  const [current, setCurrent] = useState(0);
  if (!images.length) return null;

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

function VideoEmbed({ videoId }) {
  // Nota: O Substack armazena vídeos internamente. Para este leitor web,
  // usamos uma estrutura de vídeo padrão. Se o RSS não prover a URL direta,
  // exibimos um placeholder estilizado ou tentamos reconstruir a URL.
  return (
    <div className="post-video-container">
      <video
        controls
        className="post-video-player"
        poster={`https://substack-post-media.s3.amazonaws.com/public/images/${videoId}_1920x1080.png`}
      >
        <source
          src={`https://substack.com/api/v1/video/upload/${videoId}/src`}
          type="video/mp4"
        />
        Seu navegador não suporta a reprodução de vídeos.
      </video>
    </div>
  );
}

export default function PostContent({ html }) {
  if (!html) return null;

  const parts = [];
  let lastIndex = 0;
  const regex =
    /<(div)[^>]*class="(image-gallery-embed|native-video-embed)"[^>]*data-attrs="([^"]*)"[^>]*>[\s\S]*?<\/div>/g;

  let match;
  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "html", content: html.slice(lastIndex, match.index) });
    }
    try {
      const type = match[2]; // image-gallery-embed ou native-video-embed
      const attrsRaw = match[3].replace(/&quot;/g, '"');
      const data = JSON.parse(attrsRaw);

      if (type === "image-gallery-embed") {
        parts.push({
          type: "gallery",
          images: data?.gallery?.images ?? [],
          caption: data?.gallery?.caption ?? "",
        });
      } else if (type === "native-video-embed") {
        parts.push({
          type: "video",
          videoId: data?.mediaUploadId,
        });
      }
    } catch {
      parts.push({ type: "html", content: match[0] });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    parts.push({ type: "html", content: html.slice(lastIndex) });
  }

  return (
    <div className="post-content">
      {parts.map((part, i) =>
        part.type === "gallery" ? (
          <GalleryEmbed key={i} images={part.images} caption={part.caption} />
        ) : part.type === "video" ? (
          <VideoEmbed key={i} videoId={part.videoId} />
        ) : (
          <div
            key={i}
            className="post-html-block"
            dangerouslySetInnerHTML={{ __html: part.content }}
          />
        ),
      )}
    </div>
  );
}
