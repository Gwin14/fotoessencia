import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NewsletterPostScreen.css";

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
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              className="post-gallery-btn post-gallery-next"
              onClick={() => setCurrent((c) => (c + 1) % images.length)}
              aria-label="Próxima"
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

function PostContent({ html }) {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (!html || !containerRef.current) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Processa os filhos do body
    const result = [];
    let key = 0;

    function processNode(el) {
      if (el.nodeType === Node.TEXT_NODE) return null;
      if (el.nodeType !== Node.ELEMENT_NODE) return null;

      const tag = el.tagName.toLowerCase();

      // Galeria embutida
      if (tag === "div" && el.classList.contains("image-gallery-embed")) {
        const gallery = parseGalleryEmbed(el);
        if (gallery) {
          return (
            <GalleryEmbed
              key={key++}
              images={gallery.images}
              caption={gallery.caption}
            />
          );
        }
        return null;
      }

      // Divisor
      if (tag === "div") {
        const inner = el.innerHTML.trim();
        if (inner === "<hr>" || inner === "<hr/>") {
          return <hr key={key++} className="post-divider" />;
        }
        // Div genérico — renderiza innerHTML
        return (
          <div key={key++} dangerouslySetInnerHTML={{ __html: el.innerHTML }} />
        );
      }

      // Elementos normais
      return React.createElement(el.tagName.toLowerCase(), {
        key: key++,
        dangerouslySetInnerHTML: { __html: el.innerHTML },
      });
    }

    const children = Array.from(doc.body.children);
    const mapped = children.map(processNode).filter(Boolean);
    setNodes(mapped);
  }, [html]);

  // Renderização híbrida: galerias como React, resto como dangerouslySetInnerHTML
  // mas dividindo pelo marcador de galeria
  const renderContent = () => {
    if (!html) return null;

    // Divide o HTML em segmentos pelo marcador de galeria
    const galleryRegex =
      /<div class="image-gallery-embed"[^>]*data-attrs="([^"]*)"[^>]*>[\s\S]*?<\/div>/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    const escaped = html;
    const regex =
      /<div[^>]*class="image-gallery-embed"[^>]*data-attrs="([^"]*)"[^>]*>[\s\S]*?<\/div>/g;

    while ((match = regex.exec(escaped)) !== null) {
      // Texto antes da galeria
      if (match.index > lastIndex) {
        const before = escaped.slice(lastIndex, match.index);
        parts.push({ type: "html", content: before });
      }

      // Galeria
      try {
        const attrsRaw = match[1].replace(/&quot;/g, '"');
        const data = JSON.parse(attrsRaw);
        const images = data?.gallery?.images ?? [];
        const caption = data?.gallery?.caption ?? "";
        parts.push({ type: "gallery", images, caption });
      } catch {
        parts.push({ type: "html", content: match[0] });
      }

      lastIndex = match.index + match[0].length;
    }

    // Restante após a última galeria
    if (lastIndex < escaped.length) {
      parts.push({ type: "html", content: escaped.slice(lastIndex) });
    }

    return parts.map((part, i) => {
      if (part.type === "gallery") {
        return (
          <GalleryEmbed key={i} images={part.images} caption={part.caption} />
        );
      }
      return (
        <div
          key={i}
          className="post-html-block"
          dangerouslySetInnerHTML={{ __html: part.content }}
        />
      );
    });
  };

  return (
    <div ref={containerRef} className="post-content">
      {renderContent()}
    </div>
  );
}

export default function NewsletterPostScreen() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tenta carregar do sessionStorage
    const stored = sessionStorage.getItem("newsletter_post");
    if (stored) {
      try {
        setPost(JSON.parse(stored));
        setLoading(false);
        return;
      } catch {}
    }

    // Fallback: busca o feed e acha pelo slug
    const RSS_URL = "https://fotoessencia.substack.com/feed";
    const CORS_PROXY = "https://api.allorigins.win/get?url=";

    fetch(`${CORS_PROXY}${encodeURIComponent(RSS_URL)}`)
      .then((r) => r.json())
      .then((json) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(json.contents, "text/xml");
        const items = Array.from(xml.querySelectorAll("item"));

        const found = items.find((item) => {
          const link = item.querySelector("link")?.textContent ?? "";
          return link.includes(slug);
        });

        if (found) {
          const get = (tag) =>
            found.querySelector(tag)?.textContent?.trim() ?? "";
          const encoded = found.querySelector("encoded")?.textContent ?? "";
          const enclosureUrl =
            found.querySelector("enclosure")?.getAttribute("url") ?? "";

          setPost({
            title: get("title"),
            description: get("description"),
            link: get("link"),
            pubDate: get("pubDate"),
            creator: get("creator"),
            coverImage: enclosureUrl,
            content: encoded,
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="post-screen post-loading">
        <div className="loading-dots">
          <span />
          <span />
          <span />
        </div>
        <p>Carregando publicação…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-screen post-not-found">
        <h2>Publicação não encontrada</h2>
        <button onClick={() => navigate("/newsletter")}>← Voltar</button>
      </div>
    );
  }

  return (
    <div className="post-screen">
      {/* Hero com imagem de capa */}
      {post.coverImage && (
        <div className="post-hero">
          <img src={post.coverImage} alt={post.title} />
          <div className="post-hero-gradient" />
        </div>
      )}

      <div className="post-container">
        {/* Botão voltar */}
        <button
          className="post-back-btn"
          onClick={() => navigate("/newsletter")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M13 8H3M7 4L3 8l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Newsletter
        </button>

        {/* Cabeçalho do post */}
        <header className="post-header">
          <div className="post-meta">
            <span className="post-tag">Foto Essência</span>
            {post.pubDate && (
              <time className="post-date">{formatDate(post.pubDate)}</time>
            )}
          </div>
          <h1 className="post-title">{post.title}</h1>
          {post.description && (
            <p className="post-description">{post.description}</p>
          )}
          {post.creator && (
            <div className="post-author">
              <div className="post-author-avatar">FE</div>
              <span>{post.creator}</span>
            </div>
          )}
        </header>

        <div className="post-divider-line" />

        {/* Corpo do post */}
        <PostContent html={post.content} />

        {/* Rodapé */}
        <footer className="post-footer">
          <div className="post-footer-inner">
            <p>Gostou desta publicação?</p>
            <a
              href="https://fotoessencia.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="post-subscribe-btn"
            >
              Assinar a newsletter
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
