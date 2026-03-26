import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NewsletterScreen.css";
import NewsletterCard from "../components/NewsletterCard";
import { parseRSS } from "../utils/newsletterUtils";

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
            <NewsletterCard
              key={post.guid}
              post={post}
              idx={idx}
              onClick={handlePostClick}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
