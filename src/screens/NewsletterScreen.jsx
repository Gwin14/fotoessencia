import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NewsletterScreen.css";

const RSS_URL = "https://fotoessencia.substack.com/feed";
// const CORS_PROXY = "https://api.allorigins.win/get?url=";

function parseRSS(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "text/xml");
  const items = Array.from(xml.querySelectorAll("item"));

  return items.map((item) => {
    const get = (tag) => item.querySelector(tag)?.textContent?.trim() ?? "";
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

export default function NewsletterScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await fetch("/api/rss");
        const xmlText = await res.text();
        const parsed = parseRSS(xmlText);
        setPosts(parsed);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os posts.");
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, []);

  const handlePostClick = (post) => {
    // Salva post no sessionStorage e navega
    sessionStorage.setItem("newsletter_post", JSON.stringify(post));
    const slug =
      post.link.split("/p/")[1] ?? post.guid.split("/p/")[1] ?? "post";
    navigate(`/newsletter/${slug}`);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="newsletter-screen">
      <header className="newsletter-header">
        <div className="newsletter-header-inner">
          <span className="newsletter-tag">Newsletter</span>
          <h1 className="newsletter-title">Foto Essência</h1>
          <p className="newsletter-subtitle">
            🌊 Fotos sobre praias, animais e regiões urbanas
          </p>
        </div>
      </header>

      <main className="newsletter-main">
        {loading && (
          <div className="newsletter-loading">
            <div className="loading-dots">
              <span />
              <span />
              <span />
            </div>
            <p>Carregando publicações…</p>
          </div>
        )}

        {error && <p className="newsletter-error">{error}</p>}

        {!loading && !error && posts.length === 0 && (
          <p className="newsletter-empty">Nenhuma publicação encontrada.</p>
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
                  <img src={post.coverImage} alt={post.title} loading="lazy" />
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
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
      </main>
    </div>
  );
}
