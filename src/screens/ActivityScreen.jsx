import "./ActivityScreen.css";
import "./NewsletterScreen.css";
import "./NewsletterPostScreen.css";

import { useNavigate } from "react-router-dom";
import { useYoutube } from "../context/YoutubeContext";
import { useInstagram } from "../context/InstagramContext";
import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Carousel from "../components/Carousel";
import BlurText from "../components/BlurText";
import SpotlightCard from "../components/SpotlightCard";

const RSS_URL = "https://fotoessencia.substack.com/feed";

function decodeHtmlEntities(text) {
  if (!text) return "";
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};
const pageTransition = { duration: 0.4, ease: "easeInOut" };

function parseRSS(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "text/xml");
  const items = Array.from(xml.querySelectorAll("item"));

  return items.map((item) => {
    const get = (tag) =>
      decodeHtmlEntities(item.querySelector(tag)?.textContent?.trim() ?? "");
    const encoded = item.querySelector("encoded")?.textContent ?? "";

    // Extrai imagem de capa do enclosure ou da primeira imagem do conteúdo
    const enclosureUrl =
      item.querySelector("enclosure")?.getAttribute("url") ?? "";
    let coverImage = enclosureUrl;

    if (!coverImage) {
      const imgMatch = encoded.match(
        /src="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i,
      );
      if (imgMatch) coverImage = imgMatch[1];
    }

    // Extrai primeira galeria staticGalleryImage para thumbnail
    const staticGalleryMatch = encoded.match(
      /"staticGalleryImage":\{"type":"[^"]+","src":"([^"]+)"\}/,
    );
    if (!coverImage && staticGalleryMatch) coverImage = staticGalleryMatch[1];

    // Limpa HTML para gerar excerpt
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = encoded;
    const textContent = tempDiv.textContent || "";
    const excerpt = textContent.replace(/\s+/g, " ").trim().slice(0, 200) + "…";

    return {
      title: get("title"),
      description: get("description"),
      link: get("link"),
      guid: get("guid"),
      pubDate: get("pubDate"),
      creator: get("creator"),
      coverImage,
      excerpt,
      content: encoded,
    };
  });
}

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
  const renderContent = () => {
    if (!html) return null;

    const parts = [];
    let lastIndex = 0;
    let match;

    const escaped = html;
    const regex =
      /<div[^>]*class="image-gallery-embed"[^>]*data-attrs="([^"]*)"[^>]*>[\s\S]*?<\/div>/g;

    while ((match = regex.exec(escaped)) !== null) {
      if (match.index > lastIndex) {
        const before = escaped.slice(lastIndex, match.index);
        parts.push({ type: "html", content: before });
      }

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

  return <div className="post-content">{renderContent()}</div>;
}

export default function ActivityScreen() {
  const { videos, loading } = useYoutube();
  const { images, loading: instagramLoading } = useInstagram();
  const [posts, setPosts] = useState([]);
  const [newsletterLoading, setNewsletterLoading] = useState(true);
  const [newsletterError, setNewsletterError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await fetch("/api/rss");
        const xmlText = await res.text();
        const parsed = parseRSS(xmlText);
        setPosts(parsed);
      } catch (err) {
        console.error(err);
        setNewsletterError("Não foi possível carregar os posts.");
      } finally {
        setNewsletterLoading(false);
      }
    }
    loadFeed();
  }, []);

  const navigate = useNavigate();

  const handlePostClick = (post) => {
    const slug =
      post.link.split("/p/")[1] ?? post.guid.split("/p/")[1] ?? "post";

    sessionStorage.setItem("newsletter_post", JSON.stringify(post));
    navigate(`/newsletter/${slug}`);
  };

  const handleBackToGallery = () => {
    setSelectedPost(null);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading || instagramLoading) {
    return <p>Carregando atividades...</p>;
  }

  return (
    <div className="activity-screen">
      <AnimatePresence
        mode="wait"
        onExitComplete={() => window.scrollTo({ top: 0 })}
      >
        {selectedPost ? (
          <motion.div
            key="post"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <div className="post-screen">
              {selectedPost.coverImage && (
                <div className="post-hero">
                  <img src={selectedPost.coverImage} alt={selectedPost.title} />
                  <div className="post-hero-gradient" />
                </div>
              )}

              <div className="post-container">
                <button className="post-back-btn" onClick={handleBackToGallery}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13 8H3M7 4L3 8l4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Voltar à Galeria
                </button>

                <header className="post-header">
                  <div className="post-meta">
                    <span className="post-tag">Foto Essência</span>
                    {selectedPost.pubDate && (
                      <time className="post-date">
                        {formatDate(selectedPost.pubDate)}
                      </time>
                    )}
                  </div>
                  <h1 className="post-title">{selectedPost.title}</h1>
                  {selectedPost.description && (
                    <p className="post-description">
                      {selectedPost.description}
                    </p>
                  )}
                  {selectedPost.creator && (
                    <div className="post-author">
                      <div className="post-author-avatar">FE</div>
                      <span>{selectedPost.creator}</span>
                    </div>
                  )}
                </header>

                <div className="post-divider-line" />

                <PostContent html={selectedPost.content} />

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
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
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

            <section
              className="newsletter-section"
              style={{ marginTop: "200px" }}
            >
              <div className="blur-text-div">
                <BlurText text="Newsletter" />
                <br />
                <BlurText text="Foto Essência" />
              </div>

              <div className="newsletter-main">
                {newsletterLoading && (
                  <div className="newsletter-loading">
                    <div className="loading-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <p>Carregando publicações…</p>
                  </div>
                )}

                {newsletterError && (
                  <p className="newsletter-error">{newsletterError}</p>
                )}

                {!newsletterLoading &&
                  !newsletterError &&
                  posts.length === 0 && (
                    <p className="newsletter-empty">
                      Nenhuma publicação encontrada.
                    </p>
                  )}

                <div className="newsletter-grid">
                  {posts.map((post, idx) => (
                    <article
                      key={post.guid}
                      className="newsletter-card"
                      onClick={() => handlePostClick(post)}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="newsletter-card-image">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            loading="lazy"
                          />
                        ) : (
                          <div className="newsletter-card-placeholder">
                            <span>📷</span>
                          </div>
                        )}
                        <div className="newsletter-card-overlay" />
                      </div>

                      <div className="newsletter-card-body">
                        <div className="newsletter-card-meta">
                          <time>{formatDate(post.pubDate)}</time>
                          {post.creator && (
                            <span className="newsletter-card-author">
                              {post.creator}
                            </span>
                          )}
                        </div>
                        <h2 className="newsletter-card-title">{post.title}</h2>
                        <p className="newsletter-card-excerpt">
                          {post.description || post.excerpt}
                        </p>
                        <div className="newsletter-card-cta">
                          <span>Ler publicação</span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M3 8h10M9 4l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
